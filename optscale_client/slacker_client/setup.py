#!/usr/bin/env python
import sys
from setuptools import setup

requirements = [
      "requests==2.32.4",
      "retrying>=1.3.3"
]

setup(name='slacker-client',
      description='CloudHub Slacker API Client',
      url='http://cloudhub.com',
      author='CloudHub',
      author_email='info@cloudhub.com',
      package_dir={'slacker_client': ''},
      packages=['slacker_client'],
      install_requires=requirements,
      )
