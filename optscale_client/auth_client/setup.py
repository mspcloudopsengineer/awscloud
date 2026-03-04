#!/usr/bin/env python
import sys
from setuptools import setup


requirements = ["requests==2.32.4", "retrying==1.4.1"]

setup(name='auth-client',
      description='CloudHub Auth Client',
      url='http://cloudhub.com',
      author='CloudHub',
      author_email='info@cloudhub.com',
      package_dir={'auth_client': ''},
      packages=['auth_client'],
      install_requires=requirements,
      )
