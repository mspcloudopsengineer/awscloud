#!/usr/bin/env python
from setuptools import setup

requirements = [
      'clickhouse-connect==0.8.15',
]

setup(name='optscale-data',
      description='CloudHub Data utils',
      url='http://cloudhub.com',
      author='CloudHub',
      author_email='info@cloudhub.com',
      package_dir={'optscale_data': ''},
      packages=['optscale_data'],
      install_requires=requirements,
      )
