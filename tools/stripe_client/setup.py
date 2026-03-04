#!/usr/bin/env python
from setuptools import setup

requirements = ['stripe==12.3.0', 'tenacity==9.1.2']

setup(
      name='stripe-client',
      description='CloudHub stripe client',
      url='http://cloudhub.com',
      author='CloudHub',
      author_email='info@cloudhub.com',
      package_dir={'stripe_client': ''},
      packages=['stripe_client'],
      install_requires=requirements
)
