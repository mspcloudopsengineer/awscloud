#!/usr/bin/env python
import sys
from setuptools import setup


requirements = ["requests==2.32.4", "retrying==1.4.1"]

setup(name='herald-client',
      description='CloudHub Herald Client',
      url='http://cloudhub.com',
      author='CloudHub',
      author_email='info@cloudhub.com',
      package_dir={'herald_client': ''},
      packages=['herald_client'],
      install_requires=requirements,
      )
