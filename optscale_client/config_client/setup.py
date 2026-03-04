#!/usr/bin/env python
import sys
from setuptools import setup


setup(name='config-client',
      description='CloudHub Config Client',
      author='CloudHub',
      url='http://cloudhub.com',
      author_email='info@cloudhub.com',
      package_dir={'config_client': ''},
      install_requires=['urllib3==2.5', 'python-etcd==0.4.5', 'retrying'],
      packages=['config_client']
      )
