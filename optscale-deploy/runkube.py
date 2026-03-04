#!/usr/bin/env python

import argparse
import base64
import json
import logging

import os
import time

import yaml
import subprocess

from python_on_whales import DockerClient
from python_on_whales.exceptions import NoSuchImage

from urllib.parse import urlsplit
from kubernetes import client as k8s_client, config as k8s_config
from kubernetes.client.rest import ApiException as K8SApiException
from kubernetes.stream import stream as k8s_stream
from kubernetes.stream.ws_client import ERROR_CHANNEL

DESCRIPTION = "Script to deploy OptScale on k8s (local-only build mode)."
HELM_DELETE_CMD = 'helm uninstall {release}'
HELM_UPDATE_CMD = 'helm upgrade --install {overlays} {release} {chart}'
HELM_LIST_CMD = 'helm list -a'
HELM_GET_VALUES_CMD = 'helm get values {name}'
TEMP_DIR = 'tmp'
BASE_OVERLAY = os.path.join(TEMP_DIR, 'base_overlay')
ORIGINAL_OVERLAY = os.path.join(TEMP_DIR, 'original_overlay')
CHART_NAME = 'optscale'
JOB_NAME = 'configurator'
OPTSCALE_K8S_NAMESPACE = 'default'
COMPONENTS_FILE = 'components.yaml'
LOCAL_TAG = 'local'
DOCKER_SOCKET = 'unix:///var/run/docker.sock'
CONTAINERD_SOCKET = '/run/containerd/containerd.sock'

LOG = logging.getLogger(__name__)

# https://github.com/kubernetes-client/python/issues/895
from kubernetes.client.models.v1_container_image import V1ContainerImage

def names(self, names):
    self._names = names
V1ContainerImage.names = V1ContainerImage.names.setter(names)


class Runkube:
    def __init__(self, name, config, overlays, with_elk,
                 external_clickhouse, external_mongo, use_socket,
                 version, wait_timeout=0):
        self.name = name
        if config is None:
            self.config = os.path.join(os.environ.get('HOME'), '.kube/config')
        else:
            self.config = config
        os.environ['KUBECONFIG'] = self.config
        self.overlays = overlays
        self._master_ip = None
        self._kube_cl = None
        self.with_elk = with_elk
        self.external_clickhouse = external_clickhouse
        self.external_mongo = external_mongo
        k8s_config.load_kube_config(self.config)
        self.use_socket = use_socket
        self.version = version
        self._versions_info = None
        self.wait_timeout = wait_timeout

    @property
    def kube_cl(self):
        if self._kube_cl is None:
            self._kube_cl = k8s_client.CoreV1Api()
        return self._kube_cl

    @property
    def master_ip(self):
        if self._master_ip is None:
            LOG.debug("Taking master ip from kube context %s", self.config)
            with open(self.config, 'r') as f_cxt:
                context = yaml.safe_load(f_cxt)
                self._master_ip = urlsplit(
                    context['clusters'][0]['cluster']['server']).hostname
        return self._master_ip

    @staticmethod
    def _get_image(ctrd_cl, image_name, tag):
        return ctrd_cl.image.inspect('{}:{}'.format(image_name, tag))

    def get_node_names(self):
        LOG.debug("Getting node names...")
        return [n.metadata.labels.get('kubernetes.io/hostname')
                for n in self.kube_cl.list_node().items]

    def get_ctrd_cl(self):
        cmd = ["nerdctl"]
        if self.use_socket:
            LOG.info("Using Docker socket..")
            os.environ["DOCKER_HOST"] = DOCKER_SOCKET
            os.environ["CONTAINERD_ADDRESS"] = CONTAINERD_SOCKET
        LOG.info("Connecting to container daemon on %s", self.master_ip)
        cl = DockerClient(client_call=cmd)
        return cl

    @property
    def versions_info(self):
        if self._versions_info is None:
            self._versions_info = {'optscale': self.version, 'images': {}}

            with open(COMPONENTS_FILE) as f_comp:
                components_dict = yaml.safe_load(f_comp)

            for component in components_dict:
                if component == 'elk' and not self.with_elk:
                    LOG.warning("elk specified in components file (%s) but "
                                "--with-elk is not set, ignoring it",
                                COMPONENTS_FILE)
                    continue
                self._versions_info['images'][component] = self.version

        return self._versions_info

    def verify_local_images(self, ctrd_cl):
        """Verify all required images exist locally with the expected tag."""
        missing = []
        for name in self.versions_info['images']:
            try:
                self._get_image(ctrd_cl, name, LOCAL_TAG)
            except NoSuchImage:
                missing.append(name)
        if missing:
            raise Exception(
                'Local images not found: %s. '
                'Run build.sh first.' % ', '.join(missing))
        LOG.info("All %d local images verified.", len(self.versions_info['images']))

    def get_image_id_map(self):
        LOG.debug("Getting map of image ids...")
        ctrd_cl = self.get_ctrd_cl()
        images = {}
        for service in self.versions_info['images']:
            image = self._get_image(ctrd_cl, service, LOCAL_TAG)
            images[service] = image.id
        LOG.debug("Image ids map: %s", images)
        return images

    def generate_base_overlay(self, update):
        LOG.info("Generating base overlay...")
        LOG.debug("Getting certificate from k8s cluster...")
        secret = self.kube_cl.read_namespaced_secret(
            'defaultcert', OPTSCALE_K8S_NAMESPACE)
        cert = base64.b64decode(secret.data['tls.crt'])
        key = base64.b64decode(secret.data['tls.key'])
        base_overlay = {'optscale_key': key, 'certificates': {'optscale': cert}}
        for name, image_id in self.get_image_id_map().items():
            base_overlay[name] = {'image': {'id': image_id}}

        base_overlay['public_ip'] = self.master_ip
        base_overlay['release'] = self.name
        if self.overlays:
            base_overlay['overlay_list'] = ','.join(self.overlays)

        if update:
            base_overlay['skip_config_update'] = True
        if self.with_elk:
            base_overlay['elk'] = {'enabled': True}
        if self.external_clickhouse:
            base_overlay['clickhouse'] = {'external': True}
        if self.external_mongo:
            base_overlay['mongo'] = {'external': True}

        base_overlay['nodes'] = self.get_node_names()

        LOG.debug("Saving base overlay to %s...", BASE_OVERLAY)
        with open(BASE_OVERLAY, 'w') as f:
            yaml.dump(base_overlay, f)
        return BASE_OVERLAY

    def remove_old_jobs(self):
        LOG.debug("Looking for old job...")
        batch_api = k8s_client.BatchV1Api()
        jobs = batch_api.list_namespaced_job(namespace=OPTSCALE_K8S_NAMESPACE)
        matched_jobs = [job.metadata.name for job in jobs.items
                        if JOB_NAME in job.metadata.name]
        for job in matched_jobs:
            LOG.info("Removing old job %s...", job)
            batch_api.delete_namespaced_job(
                name=job, namespace=OPTSCALE_K8S_NAMESPACE,
                body=k8s_client.V1DeleteOptions(propagation_policy='Foreground')
            )
        LOG.info("Waiting for job deletion...")
        deleted_jobs = {job: False for job in matched_jobs}
        while not all(deleted_jobs.values()):
            for job in deleted_jobs.keys():
                if deleted_jobs[job]:
                    continue
                try:
                    batch_api.read_namespaced_job(job,
                                                  namespace=OPTSCALE_K8S_NAMESPACE)
                except K8SApiException as exc:
                    if json.loads(exc.body).get('code') == 404:
                        deleted_jobs[job] = True
            time.sleep(0.2)

    def etcd_pod_name(self):
        LOG.debug('Looking for first etcd pod')
        pods = self.kube_cl.list_namespaced_pod(
            OPTSCALE_K8S_NAMESPACE, label_selector='app=etcd')
        pod_name = pods.items[0].metadata.name
        LOG.debug('first pod name: %s', pod_name)
        return pod_name

    def delete_configured_key(self):
        LOG.info("Deleting /configured key")
        cmd = 'etcdctl rm configured'.split()
        try:
            etcd_pod = self.etcd_pod_name()
            resp = k8s_stream(self.kube_cl.connect_get_namespaced_pod_exec,
                              etcd_pod, OPTSCALE_K8S_NAMESPACE, command=cmd,
                              stderr=True, stdin=False, stdout=True, tty=False)
            LOG.debug("delete response: %s", resp)
        except K8SApiException as exc:
            if 'Handshake status 404' not in exc.reason:
                raise
        except IndexError:
            LOG.info('etcd pod not found')

    def check_releases(self, update):
        LOG.debug("Checking deployed releases")
        out_lines = subprocess.check_output(
            HELM_LIST_CMD.split()).decode().split('\n')
        optscale_releases = [r.split()[0] for r in filter(
            lambda x: 'optscale' in x, out_lines)]
        if len(optscale_releases) > 1:
            raise Exception(
                "More than 1 optscale release found: {0}".format(optscale_releases))
        elif len(optscale_releases) == 1:
            if optscale_releases[0] != self.name:
                raise Exception("Specified release name {0} doesn't match "
                                "existing one {1}".format(self.name,
                                                          optscale_releases[0]))
        elif update:
            raise Exception("Existing release {0} "
                            "not found for update".format(self.name))

    def get_old_overlay_list_for_update(self):
        LOG.info("Getting old overlay list")
        cmd = 'etcdctl get /overlay_list'.split()
        try:
            etcd_pod = self.etcd_pod_name()
            client = k8s_stream(self.kube_cl.connect_get_namespaced_pod_exec,
                                etcd_pod, OPTSCALE_K8S_NAMESPACE, command=cmd,
                                stderr=True, stdin=False, stdout=True,
                                tty=False, _preload_content=False)
            client.run_forever(timeout=60)
            err = client.read_channel(ERROR_CHANNEL)
            if yaml.safe_load(err)['status'].lower() == 'failure':
                return []
            overlay_str = client.read_all().rstrip()
            overlay_list = [] if not overlay_str else overlay_str.split(',')
            LOG.debug("overlay list: %s", overlay_list)
            return overlay_list
        except K8SApiException as exc:
            if 'Handshake status 404' not in exc.reason:
                raise
        except IndexError:
            LOG.info('etcd pod not found')

    def start(self, check, update):
        self.check_releases(update)
        ctrd_cl = self.get_ctrd_cl()
        LOG.info('Verifying local images...')
        self.verify_local_images(ctrd_cl)

        overlays = []
        LOG.debug("Creating temp dir %s", TEMP_DIR)
        os.makedirs(TEMP_DIR, mode=0o755, exist_ok=True)
        if update:
            old_overlay_list = self.get_old_overlay_list_for_update()
            if old_overlay_list:
                overlays.extend(old_overlay_list)

        overlays.append(self.generate_base_overlay(update))
        if update and self.overlays:
            raise Exception("--update-only flag must be used without overlays")
        elif self.overlays:
            overlays.extend(self.overlays)
        overlays_str = ' '.join(['-f {0}'.format(overlay)
                                for overlay in overlays])
        update_cmd = HELM_UPDATE_CMD.format(
            overlays=overlays_str, release=self.name, chart=CHART_NAME)

        if self.wait_timeout:
            update_cmd += ' --wait --timeout {}'.format(self.wait_timeout)

        LOG.info('Creating component_versions.yaml file to insert it '
                 'into configmap')
        with open('{}/component_versions.yaml'.format(CHART_NAME), 'w') as file:
            file.write(yaml.dump(self.versions_info, sort_keys=False))

        LOG.debug("Generated update cmd: %s", update_cmd)
        if check:
            update_cmd += ' --debug --dry-run'
        else:
            self.delete_configured_key()
            self.remove_old_jobs()
        LOG.info("Starting helm chart %s with name %s on k8s cluster %s",
                 CHART_NAME, self.name, self.master_ip)
        subprocess.run(update_cmd.split(), check=True)

    def delete(self):
        delete_cmd = HELM_DELETE_CMD.format(release=self.name)
        LOG.debug("Delete cmd: %s", delete_cmd)
        LOG.info("Deleting optscale cluster %s on k8s %s",
                 self.name, self.master_ip)
        subprocess.run(delete_cmd.split(), check=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description=DESCRIPTION,
        formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('name', help='Release name for helm')
    parser.add_argument('version', help='OptScale version tag (e.g. "local")')
    parser.add_argument('-c', '--config', help='Path to kube config file')
    action_group = parser.add_mutually_exclusive_group(required=False)
    action_group.add_argument('-r', '--restart', action='store_true',
                              help='Remove installed OptScale before deploy')
    action_group.add_argument('-d', '--delete', action='store_true',
                              help='Delete installed OptScale')
    action_group.add_argument('--check', action='store_true',
                              help='Helm dry run to check if chart is valid')
    parser.add_argument('-o', '--overlays', nargs='*',
                        help='Overlay config files')
    parser.add_argument('--with-elk', action='store_true', default=False,
                        help="Start ELK as part of OptScale")
    parser.add_argument('--external-clickhouse', action='store_true',
                        default=False,
                        help='Connect to external clickhouse')
    parser.add_argument('--external-mongo', action='store_true',
                        default=False,
                        help='Connect to external mongodb')
    parser.add_argument('-u', '--update-only', action='store_true',
                        default=False,
                        help="Only update images and restart related pods")
    parser.add_argument('--use-socket', action='store_true',
                        default=False, help="Use docker socket")
    parser.add_argument('-v', '--verbose', help="Enable debug logging",
                        action='store_true')
    parser.add_argument('-w', '--wait', type=int, default=0,
                        help="Wait for deployment completion (seconds)")
    args = parser.parse_args()
    log_level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(level=log_level, datefmt='%H:%M:%S',
                        format='%(asctime)s.%(msecs)03d: %(message)s')
    acr = Runkube(
        name=args.name,
        config=args.config,
        overlays=args.overlays,
        with_elk=args.with_elk,
        external_clickhouse=args.external_clickhouse,
        external_mongo=args.external_mongo,
        use_socket=args.use_socket,
        version=args.version,
        wait_timeout=args.wait,
    )
    if args.delete or args.restart:
        acr.delete()
    if not args.delete:
        acr.start(args.check, args.update_only)
