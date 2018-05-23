![Build Status](https://travis-ci.com/secureCodeBox/scanner-infrastructure-sslyze.svg?token=Hpx3VekB3dxuZX1bYFME&branch=develop)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Known Vulnerabilities](https://snyk.io/test/github/secureCodeBox/scanner-infrastructure-sslyze/badge.svg)](https://snyk.io/test/github/secureCodeBox/scanner-infrastructure-sslyze)

# About
This repository contains a self contained µService utilizing the SSLyze SSL scanner for the secureCodeBox Application.

## Configuration Options
To configure this service specify the following environment variables:

| Environment Variable       | Value Example         |
| -------------------------- | --------------------- |
| ENGINE_ADDRESS             | http://engine         |
| ENGINE_BASIC_AUTH_USER     | username              |
| ENGINE_BASIC_AUTH_PASSWORD | 123456                |

## Development

### Local setup

1.  Clone the repository
2.  Install the dependencies `npm install`
3.  Run localy `npm start`

### Test

To run the testsuite run:

`npm test`

### Build with docker
To build the docker container run: `docker build -t CONTAINER_NAME:LABEL .`
