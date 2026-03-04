#!/usr/bin/env python
import sys
from setuptools import setup


requirements = ["requests==2.32.4", "retrying>=1.3.3"]

setup(
    name="jira-bus-client",
    description="CloudHub Jira Bus API Client",
    url="http://cloudhub.com",
    author="CloudHub",
    author_email="info@cloudhub.com",
    package_dir={"jira_bus_client": ""},
    packages=["jira_bus_client"],
    install_requires=requirements,
)
