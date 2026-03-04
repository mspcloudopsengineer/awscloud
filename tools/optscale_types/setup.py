#!/usr/bin/env python
import sys
from setuptools import setup

requirements = ['requests==2.32.4', 'SQLAlchemy==1.3.24',
                'optscale-exceptions==0.0.0', 'netaddr==0.7.19']

setup(name='optscale-types',
      description='CloudHub Types',
      url='http://cloudhub.com',
      author='CloudHub',
      author_email='info@cloudhub.com',
      package_dir={'optscale_types': ''},
      packages=['optscale_types'],
      install_requires=requirements,
      )
