---
title: "SSLyze"
path: "scanner/SSLyze"
category: "scanner"
usecase: "SSL/TLS Configuration Scanner"
release: "https://img.shields.io/github/release/secureCodeBox/scanner-infrastructure-sslyze.svg"

---

SSLyze is a Python library and a CLI tool that can analyze the SSL configuration of a server by connecting to it. It is designed to be fast and comprehensive, and should help organizations and testers identify mis-configurations affecting their SSL/TLS servers.

<!-- end -->

# About
This repository contains a self contained µService utilizing the SSLyze SSL scanner for the secureCodeBox Application. To learn more about the SSLyze scanner itself visit or [SSLyze GitHub].

## SSLyze parameters

To hand over supported parameters through api usage, you can set following attributes:

```json
[
  {
    "name": "sslyze",
    "context": "some Context",
    "target": {
      "name": "targetName",
      "location": "http://your-target.com/",
      "attributes": {
      "SSLYZE_PARAMETER": "[String parameter]"//See oficcial SSLyze documentation"
      }
    }
  }
]
```

## Example

Example configuration:

```json
[
  {
    "name": "sslyze",
    "context": "Example Test",
    "target": {
      "name": "BodgeIT",
      "location": "bodgeit.example.com",
      "attributes": {
        "SSLYZE_PARAMETER": ""
        }
    }
  }
]
```

Example Output:

```json
{
  "findings": [
    {
      "id": "d50c9cad-2d64-4fd8-9ad9-cdfdd63bfec0",
      "name": "Must-Staple unsupported",
      "description": "Leaf certificate does not support OCSP Must-Staple extension as defined in RFC 6066.",
      "category": "Certificate info",
      "osi_layer": "PRESENTATION",
      "severity": "INFORMATIONAL",
      "location": "https://bodgeit.example.com:443",
      "false_positive": false
    },
    {
      "id": "47554b12-11ea-43ed-992a-1c280754b2d3",
      "name": "Certificate includes SCTS count",
      "description": "The number of Signed Certificate Timestamps (SCTs) for Certificate Transparency is embedded in the leaf certificate. Its value is 2.",
      "category": "Certificate info",
      "osi_layer": "PRESENTATION",
      "severity": "INFORMATIONAL",
      "attributes": {
        "scts_count": 2
      },
      "location": "https://bodgeit.example.com:443",
      "false_positive": false
    },
    {
      "id": "cc36682f-52b5-433b-93ee-05f72946b6df",
      "name": "No extended validation certificate",
      "description": "The certificate has not been validated by the certificate authority according to the standardized set of requirements set out in the CA/Browser Forum Extended Validation Certificate Guidelines. (https://wiki.mozilla.org/EV)",
      "category": "Certificate info",
      "osi_layer": "PRESENTATION",
      "severity": "INFORMATIONAL",
      "location": "https://bodgeit.example.com:443",
      "false_positive": false
    },
    {
      "id": "ebf8a06b-c889-498a-a9cf-435ca6b5bcbe",
      "name": "No OCSP response",
      "description": "The server did not send an OCSP response.",
      "category": "Certificate info",
      "osi_layer": "PRESENTATION",
      "severity": "INFORMATIONAL",
      "location": "https://bodgeit.example.com:443",
      "false_positive": false
    },
    {
      "id": "48b08451-6f90-4b4b-8451-5b25a61eab93",
      "name": "Ticket resumption supported",
      "description": "The server supports session resumption through ticket encapsulation.",
      "category": "Resumption",
      "osi_layer": "PRESENTATION",
      "severity": "INFORMATIONAL",
      "location": "https://bodgeit.example.com:443",
      "false_positive": false
    },
    {
      "id": "d13024c2-bd6a-40eb-b00e-20bc0a791139",
      "name": "Session resumption failed",
      "description": "At least one session resumption failed.",
      "category": "Resumption",
      "osi_layer": "PRESENTATION",
      "severity": "LOW",
      "attributes": {
        "error": null
      },
      "location": "https://bodgeit.example.com:443",
      "false_positive": false
    },
    {
      "id": "e95cd322-bc68-41ea-895e-f097e569f75f",
      "name": "TLSv1 supported",
      "description": "The server supports at least one cipher suite using the TLSv1 protocol.",
      "category": "TLSv1",
      "osi_layer": "PRESENTATION",
      "severity": "LOW",
      "location": "https://bodgeit.example.com:443",
      "false_positive": false
    },
    {
      "id": "f9a9eeb7-8f70-4b23-ba4d-148e6f868581",
      "name": "TLSv1.1 supported",
      "description": "The server supports at least one cipher suite using the TLSv1.1 protocol.",
      "category": "TLSv1.1",
      "osi_layer": "PRESENTATION",
      "severity": "INFORMATIONAL",
      "location": "https://bodgeit.example.com:443",
      "false_positive": false
    },
    {
      "id": "14b13a7e-03ff-4a26-aee6-3f21b0b54dd4",
      "name": "TLSv1.2 supported",
      "description": "The server supports at least one cipher suite using the TLSv1.2 protocol.",
      "category": "TLSv1.2",
      "osi_layer": "PRESENTATION",
      "severity": "INFORMATIONAL",
      "location": "https://bodgeit.example.com:443",
      "false_positive": false
    }
  ]
}
```

## Development

### Configuration Options
To configure this service specify the following environment variables:

| Environment Variable       | Value Example         |
| -------------------------- | --------------------- |
| ENGINE_ADDRESS             | http://engine         |
| ENGINE_BASIC_AUTH_USER     | username              |
| ENGINE_BASIC_AUTH_PASSWORD | 123456                |

### Local setup

1.  Clone the repository
2.  Install the dependencies `npm install`
3.  Run localy `npm start`

### Test

To run the testsuite run:

`npm test`

### Build with docker
To build the docker container run: `docker build -t CONTAINER_NAME:LABEL .`


[![Build Status](https://travis-ci.com/secureCodeBox/scanner-infrastructure-sslyze.svg?branch=master)](https://travis-ci.com/secureCodeBox/scanner-infrastructure-sslyze)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Known Vulnerabilities](https://snyk.io/test/github/secureCodeBox/scanner-infrastructure-sslyze/badge.svg)](https://snyk.io/test/github/secureCodeBox/scanner-infrastructure-sslyze)
[![GitHub release](https://img.shields.io/github/release/secureCodeBox/scanner-infrastructure-sslyze.svg)](https://github.com/secureCodeBox/scanner-infrastructure-sslyze/releases/latest)


[SSLyze GitHub]: https://github.com/nabla-c0d3/sslyze
