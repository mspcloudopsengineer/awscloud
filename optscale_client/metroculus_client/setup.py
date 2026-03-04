#!/usr/bin/env python
from setuptools import setup


requirements = ["requests==2.32.4", "retrying==1.4.1"]

setup(name='metroculus-client',
      description='CloudHub Metroculus Client',
      url='http://cloudhub.com',
      author='CloudHub',
      author_email='info@cloudhub.com',
      package_dir={'metroculus_client': ''},
      packages=['metroculus_client'],
      install_requires=requirements,
      )
