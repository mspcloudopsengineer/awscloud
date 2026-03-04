#!/usr/bin/env python
import sys
from setuptools import setup


requirements = ['tornado==6.5', 'requests==2.32.4']

setup(name='optscale-exceptions',
      description='CloudHub Exceptions',
      url='http://cloudhub.com',
      author='CloudHub',
      author_email='info@cloudhub.com',
      package_dir={'optscale_exceptions': ''},
      packages=['optscale_exceptions'],
      install_requires=requirements,
      )
