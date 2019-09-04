---
title: "SSLyze"
path: "scanner/SSLyze"
category: "scanner"
usecase: "SSL/TLS Configuration Scanner"

---

SSLyze is a Python library and a CLI tool that can analyze the SSL configuration of a server by connecting to it. It is designed to be fast and comprehensive, and should help organizations and testers identify mis-configurations affecting their SSL/TLS servers.

<!-- end -->

# About
This repository contains a self contained µService utilizing the SSLyze SSL scanner for the secureCodeBox Application.

<!-- end -->

Further Documentation:
* [Project Description][scb-project]
* [Developer Guide][scb-developer-guide]
* [User Guide][scb-user-guide]

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


[![Build Status](https://travis-ci.com/secureCodeBox/scanner-infrastructure-sslyze.svg?branch=develop)](https://travis-ci.com/secureCodeBox/scanner-infrastructure-sslyze)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Known Vulnerabilities](https://snyk.io/test/github/secureCodeBox/scanner-infrastructure-sslyze/badge.svg)](https://snyk.io/test/github/secureCodeBox/scanner-infrastructure-sslyze)
[![GitHub release](https://img.shields.io/github/release/secureCodeBox/scanner-infrastructure-sslyze.svg)](https://github.com/secureCodeBox/scanner-infrastructure-sslyze/releases/latest)


[scb-project]:              https://github.com/secureCodeBox/secureCodeBox
[scb-developer-guide]:      https://github.com/secureCodeBox/secureCodeBox/blob/develop/docs/developer-guide/README.md
[scb-developer-guidelines]: https://github.com/secureCodeBox/secureCodeBox/blob/develop/docs/developer-guide/README.md#guidelines
[scb-user-guide]:           https://github.com/secureCodeBox/secureCodeBox/tree/develop/docs/user-guide
