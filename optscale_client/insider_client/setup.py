#!/usr/bin/env python
from setuptools import setup


requirements = ["requests==2.32.4", "retrying>=1.4.1"]

setup(name='insider-client',
      description='CloudHub Insider Client',
      url='http://cloudhub.com',
      author='CloudHub',
      author_email='info@cloudhub.com',
      package_dir={'insider_client': ''},
      packages=['insider_client'],
      install_requires=requirements,
      )
