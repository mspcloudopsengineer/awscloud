#!/usr/bin/env python
import sys
from setuptools import setup


requirements = ["requests==2.32.4", "retrying==1.4.1"]

setup(
    name="katara-client",
    description="Katara Client",
    url="http://cloudhub.com",
    author="CloudHub",
    author_email="info@cloudhub.com",
    package_dir={"katara_client": ""},
    packages=["katara_client"],
    install_requires=requirements,
)
