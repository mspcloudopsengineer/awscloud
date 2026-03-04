#!/usr/bin/env python
import sys
from setuptools import setup


setup(name='aconfig-cl',
      description='CloudHub Async Config Client Prototype',
      author='CloudHub',
      url='http://cloudhub.com',
      author_email='info@cloudhub.com',
      package_dir={'aconfig_cl': ''},
      install_requires=['aiohttp==3.12.15'],
      packages=['aconfig_cl']
      )
