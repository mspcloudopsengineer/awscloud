#!/usr/bin/env python
import sys
from setuptools import setup

requirements = []

setup(name='optscale-password',
      description='CloudHub Password',
      url='http://cloudhub.com',
      author='CloudHub',
      author_email='info@cloudhub.com',
      package_dir={'optscale_password': ''},
      packages=['optscale_password'],
      install_requires=requirements,
      )
