#!/usr/bin/env python
import sys
from setuptools import setup


requirements = ["httpx==0.28.1", "tenacity==9.1.2"]

setup(
    name="subspector-async-client",
    description="Subspector Async Client",
    url="http://cloudhub.com",
    author="CloudHub",
    author_email="info@cloudhub.com",
    package_dir={"subspector_async_client": ""},
    packages=["subspector_async_client"],
    install_requires=requirements,
)
