import json
import logging
import os
from datetime import UTC, datetime

# CloudHub images - replace these CDN URLs with your own when available
# 'background': 'https://cdn.hystax.com/OptScale/email-header-background.png'
# 'logo_new': 'https://cdn.hystax.com/OptScale/email-images/logo-new.png'

CUSTOM_CONTEXT_FILE = "custom_templates/custom_context.json"
LOG = logging.getLogger(__name__)


def generate_event_template_params(event, config_client):
    subject = (
        f"{config_client.company_name()} {config_client.product_name()} Notification "
        f"{event.get('level')} - {event.get('evt_class')}"
    )
    template_params = {
        "images": {
            "level": _relevant_image_name(event.get("level")),
            "object_type": _relevant_image_name(event.get("object_type")),
        },
        "texts": {
            "object_name": event.get("object_name"),
            "title": "CloudHub notifications service",
            "top_text": "You have received the following notification for the customer ",
            "bottom_text1": "You have received this email because you have event notification turned on. Please use ",
            "bottom_text2": "if you want to alter your notification settings.",
        },
    }
    additional_info = _get_additional_info(config_client, event)
    template_params["texts"].update(additional_info)
    return subject, template_params


def _get_additional_info(config_client, event):
    customer_name = ""
    return {"customer_name": customer_name}


def _get_control_panel_link(config_client):
    control_panel_link = ""
    try:
        control_panel_link = "https://%s" % config_client.public_ip()
    except Exception:
        pass
    return control_panel_link


def _relevant_image_name(event_type):
    # TODO: Replace these CDN URLs with your own hosted images
    circle_grey_url = "https://cdn.hystax.com/OptScale/email-images/circle-grey.png"
    return {
        "INFO": circle_grey_url,
        "SUCCESS": "https://cdn.hystax.com/OptScale/email-images/circle-green.png",
        "WARNING": "https://cdn.hystax.com/OptScale/email-images/circle-yellow.png",
        "ERROR": "https://cdn.hystax.com/OptScale/email-images/triangle-red.png",
        "customer": "https://cdn.hystax.com/OptScale/email-images/users.png",
        "cloudsite": "https://cdn.hystax.com/OptScale/email-images/cloud.png",
        "device": "https://cdn.hystax.com/OptScale/email-images/desktop.png",
        "agent": "https://cdn.hystax.com/OptScale/email-images/shield.png",
    }.get(event_type, circle_grey_url)


def get_default_context():
    return {
        "images": {
            # TODO: Replace these CDN URLs with your own hosted images
            "logo": "https://cdn.hystax.com/OptScale/OptScale-logo-white.png",
            "telegram": "https://cdn.hystax.com/OptScale/email-images/telegram.png",
            "optscale_ml_banner": "https://cdn.hystax.com/OptScale/email-images/optscale-ml-welcome-banner.png",
            "optscale_finops": "https://cdn.hystax.com/OptScale/email-images/optscale-finops-capabilities.png",
        },
        "texts": {
            "product": "CloudHub",
            "dont_reply": "Please do not reply to this email",
            "copyright": "Copyright © 2016-%s" % datetime.now(tz=UTC).year,
            "copyright_company_name": "CloudHub",
            "address": "",
            "phone": "",
            "support_email": "support@cloudhub.com",
        },
        "etcd": {"control_panel_link": "/public_ip", "company_name": "/company_name", "product_name": "/product_name"},
        "links": {
            "linkedin": "",
            "twitter": "",
            "facebook": "",
            "telegram": "",
            "terms_of_use": "https://cloudhub.com/terms-of-use/",
            "privacy_policy": "https://cloudhub.com/privacy-policy/",
            "documentation": "https://docs.cloudhub.com/",
            "background_image": "https://cdn.hystax.com/OptScale/email-header-background.png",
            "e2e_azure": "https://docs.cloudhub.com/e2e-guides/e2e-azure.html",
            "e2e_aws": "https://docs.cloudhub.com/e2e-guides/e2e-aws.html",
            "e2e_gcp": "https://docs.cloudhub.com/e2e-guides/e2e-gcp.html",
            "e2e_alibaba": "https://docs.cloudhub.com/e2e-guides/e2e-alibaba.html",
            "e2e_k8s": "https://docs.cloudhub.com/e2e-guides/e2e-kubernetes.html",
        },
    }


def get_custom_context():
    data = {}
    context_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), CUSTOM_CONTEXT_FILE)
    if os.path.exists(context_path):
        try:
            data = json.load(open(context_path, encoding="utf-8"))
        except Exception as exc:
            LOG.warning("Failed to load custom context file: %s, will use default context", str(exc))
    return data
