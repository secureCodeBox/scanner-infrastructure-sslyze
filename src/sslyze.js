/*
 *
 *  SecureCodeBox (SCB)
 *  Copyright 2015-2018 iteratec GmbH
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  	http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 * /
 */
const _ = require('lodash');
const uuid = require('uuid/v4');
const sprintf_js = require('sprintf-js');
const sprintf = sprintf_js.sprintf;

const sslscan = require('../lib/sslscan');

/**
 * Enum for representing the different OSI layers
 */
const OsiLayer = Object.freeze({
    APPLICATION: 'APPLICATION',
    PRESENTATION: 'PRESENTATION',
    SESSION: 'SESSION',
    TRANSPORT: 'TRANSPORT',
    NETWORK: 'NETWORK',
    DATA_LINK: 'DATA_LINK',
    PHYSICAL: 'PHYSICAL',
    NOT_APPLICABLE: 'NOT_APPLICABLE',
});

/**
 * Enum for representing the different severity levels
 */
const Severity = Object.freeze({
    INFORMATIONAL: 'INFORMATIONAL',
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
});

/**
 * Enum for representing the different finding types
 */
const FindingCategory = Object.freeze({
    CERT_INFO: 'Certificate info',
    COMPRESSION: 'Compression',
    FALLBACK: 'Fallback',
    HEARTBLEED: 'Heartbleed',
    CCS: 'CCS',
    RENEG: 'Renegotiation',
    RESUM: 'Resumption',
    ROBOT: 'Robot',
    SSLV2: 'SSLv2',
    SSLV3: 'SSLv3',
    TLSV1: 'TLSv1',
    TLSV1_1: 'TLSv1.1',
    TLSV1_2: 'TLSv1.2',
    TLSV1_3: 'TLSv1.3',
});

/**
 * Prototypes are used as a base when constructing new findings
 */
const FindingPrototypes = Object.freeze({
    // Certificate info findings
    CERTINFO_ERROR: {
        name: 'Certificate info error',
        description: 'Certificate info could not be retrieved due to error: %s',
        osi_layer: OsiLayer.NOT_APPLICABLE,
        severity: Severity.HIGH,
        category: FindingCategory.CERT_INFO,
    },
    CERTINFO_HAS_MUST_STAPLE_EXTENSION: {
        name: 'Certificate has Must-Staple',
        description: 'Leaf certificate supports OCSP Must-Staple extension as defined in RFC 6066.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.CERT_INFO,
    },
    CERTINFO_INCLUDES_SCTS_COUNT: {
        name: 'Certificate includes SCTS count',
        description:
            'The number of Signed Certificate Timestamps (SCTs) for Certificate Transparency is embedded in the leaf certificate. Its value is %d.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.CERT_INFO,
    },
    CERTINFO_NO_ANCHOR_IN_CERTIFICATE_CHAIN: {
        name: 'No anchor/root certificate sent',
        description: 'The server did not include the anchor/root certificate in the chain.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.CERT_INFO,
    },
    CERTINFO_SHA1_IN_CERTIFICATE_CHAIN: {
        name: 'SHA1 in certificate chain',
        description:
            'Some of the leaf or intermediate certificates are signed using the SHA-1 algorithm.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.CERT_INFO,
    },
    CERTINFO_CHAIN_ORDER_INVALID: {
        name: 'Chain order invalid',
        description: 'The chain order sent by the server is invalid.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.CERT_INFO,
    },
    CERTINFO_NOT_EV: {
        name: 'No extended validation certificate',
        description:
            'The certificate has not been validated by the certificate authority according to the standardized set of requirements set out in the CA/Browser Forum Extended Validation Certificate Guidelines. (https://wiki.mozilla.org/EV)',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.CERT_INFO,
    },
    CERTINFO_NO_OCSP_RESPONSE: {
        name: 'No OCSP response',
        description: 'The server did not send an OCSP response.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.CERT_INFO,
    },
    CERTINFO_OCSP_RESPONSE_IS_NOT_TRUSTED: {
        name: 'OCSP response not trusted',
        description:
            'The server sent an OCSP response which is not trusted using the Mozilla trust store.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.CERT_INFO,
    },
    CERTINFO_HAS_PATH_VALIDATION_ERROR: {
        name: 'Certificate chain validation error',
        description:
            "An error occurred while attempting to validate the server's certificate chain: %s", // eslint-disable-line
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.CERT_INFO,
    },
    CERTINFO_WILL_BE_DISTRUSTED: {
        name: 'Certificate will be distrusted',
        description:
            'The certificate was issued by one of the Symantec CAs and will be distrusted in Chrome and Firefox in %s.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.CERT_INFO,
    },
    // Compression findings
    COMPRESSION_METHOD_EXPOSED: {
        name: 'Compression method exposed',
        description: 'The server supports the compression algorithm %s.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.COMPRESSION,
    },
    // Fallback findings
    FALLBACK_NO_SCSV_SUPPORT: {
        name: 'No SCSV fallback support',
        description:
            'The server does not support the SCSV cipher suite which would prevent downgrade attacks if it was supported.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.FALLBACK,
    },
    // Heartbleed findings
    HEARTBLEED_VULNERABLE: {
        name: 'Vulnerable to Heartbleed',
        description: 'The server is vulnerable to the Heartbleed attack.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.HIGH,
        category: FindingCategory.HEARTBLEED,
    },
    // CCS injection findings
    CCS_VULNERABLE: {
        name: 'Vulnerable to CCS injection',
        description: "The server is vulnerable to OpenSSL's CCS injection issue.", // eslint-disable-line
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.HIGH,
        category: FindingCategory.CCS,
    },
    // Renegotiation findings
    RENEG_ACCEPTED: {
        name: 'Accepts client renegotiation',
        description: 'The server honors client-initiated renegotiation attempts.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.HIGH,
        category: FindingCategory.RENEG,
    },
    RENEG_NO_SECURE_SUPPORT: {
        name: 'No support for secure renegotiation',
        description: 'The server does not support secure renegotiation.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.HIGH,
        category: FindingCategory.RENEG,
    },
    // Session resumption findings
    RESUM_ERROR: {
        name: 'Session resumption error',
        description: 'Session resumption information could not be retrieved due to error: %s',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.RESUM,
    },
    RESUM_TICKET_RESUMPTION_UNSUPPORTED: {
        name: 'Ticket resumption not supported',
        description: 'The server does not support session resumption through ticket encapsulation.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.RESUM,
    },
    RESUM_TICKET_RESUMPTION_SUPPORTED: {
        name: 'Ticket resumption supported',
        description: 'The server supports session resumption through ticket encapsulation.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.RESUM,
    },
    RESUM_SUCCEEDED: {
        name: 'Session resumption succeeded',
        description: 'At least one session resumption succeeded.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.RESUM,
    },
    RESUM_FAILED: {
        name: 'Session resumption failed',
        description: 'At least one session resumption failed.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.RESUM,
    },
    // ROBOT findings
    ROBOT_VULNERABLE: {
        name: 'Vulnerable to ROBOT attack',
        description: 'The server is vulnerable to the "Return Of Bleichenbacher\'s Oracle Threat".',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.HIGH,
        category: FindingCategory.ROBOT,
    },
    ROBOT_PROBABLY_VULNERABLE: {
        name: 'Probably vulnerable to ROBOT attack',
        description:
            'The server may be vulnerable to the "Return Of Bleichenbacher\'s Oracle Threat". However, the results were inconsistent.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.MEDIUM,
        category: FindingCategory.ROBOT,
    },
    // SSLv2 findings
    SSLV2_SUPPORTED: {
        name: 'SSLv2 supported',
        description: 'The server supports at least one cipher suite using the SSLv2 protocol.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.SSLV2,
    },
    SSLV2_ERROR: {
        name: 'SSLv2 negotation error',
        description: 'At least one error occurred during negotiation using the SSLv2 protocol.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.SSLV2,
    },
    // SSLv3 findings
    SSLV3_SUPPORTED: {
        name: 'SSLv3 supported',
        description: 'The server supports at least one cipher suite using the SSLv3 protocol.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.SSLV3,
    },
    SSLV3_ERROR: {
        name: 'SSLv3 negotation error',
        description: 'At least one error occurred during negotiation using the SSLv3 protocol.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.SSLV3,
    },
    // TLSv1 findings
    TLSV1_SUPPORTED: {
        name: 'TLSv1 supported',
        description: 'The server supports at least one cipher suite using the TLSv1 protocol.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.TLSV1,
    },
    TLSV1_ERROR: {
        name: 'TLSv1 negotation error',
        description: 'At least one error occurred during negotiation using the TLSv1 protocol.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.TLSV1,
    },
    // TLSv1.1 findings
    TLSV1_1_SUPPORTED: {
        name: 'TLSv1.1 supported',
        description: 'The server supports at least one cipher suite using the TLSv1.1 protocol.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.TLSV1_1,
    },
    TLSV1_1_ERROR: {
        name: 'TLSv1.1 negotation error',
        description: 'At least one error occurred during negotiation using the TLSv1.1 protocol.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.TLSV1_1,
    },
    // TLSv1.2 findings
    TLSV1_2_SUPPORTED: {
        name: 'TLSv1.2 supported',
        description: 'The server supports at least one cipher suite using the TLSv1.2 protocol.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.TLSV1_2,
    },
    TLSV1_2_ERROR: {
        name: 'TLSv1.2 negotation error',
        description: 'At least one error occurred during negotiation using the TLSv1.2 protocol.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.TLSV1_2,
    },
    // TLSv1.3 findings
    TLSV1_3_SUPPORTED: {
        name: 'TLSv1.3 supported',
        description: 'The server supports at least one cipher suite using the TLSv1.3 protocol.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.TLSV1_3,
    },
    TLSV1_3_ERROR: {
        name: 'TLSv1.3 negotation error',
        description: 'At least one error occurred during negotiation using the TLSv1.3 protocol.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.INFORMATIONAL,
        category: FindingCategory.TLSV1_3,
    },
});

/**
 * Build finding data structures from SSLyze results
 */
class FindingBuilder {
    constructor(data) {
        this.data = data;
    }

    /**
     * Transforms SSLyze results to SCB findings.
     */
    transformData() {
        let findings = [];

        findings = findings.concat(this.transformCertInfo(this.data.commands_results.certinfo));
        findings = findings.concat(
            this.transformCompression(this.data.commands_results.compression)
        );
        findings = findings.concat(this.transformFallback(this.data.commands_results.fallback));
        findings = findings.concat(this.transformHeartbleed(this.data.commands_results.heartbleed));
        findings = findings.concat(this.transformCCS(this.data.commands_results.openssl_ccs));
        findings = findings.concat(this.transformReneg(this.data.commands_results.reneg));
        findings = findings.concat(this.transformResum(this.data.commands_results.resum));
        findings = findings.concat(this.transformRobot(this.data.commands_results.robot));
        findings = findings.concat(this.transformSSLv2(this.data.commands_results.sslv2));
        findings = findings.concat(this.transformSSLv3(this.data.commands_results.sslv3));
        findings = findings.concat(this.transformTLSv1(this.data.commands_results.tlsv1));
        findings = findings.concat(this.transformTLSv1_1(this.data.commands_results.tlsv1_1));
        findings = findings.concat(this.transformTLSv1_2(this.data.commands_results.tlsv1_2));
        findings = findings.concat(this.transformTLSv1_3(this.data.commands_results.tlsv1_3));

        return findings;
    }

    /**
     * Transforms SSLyze `certinfo` data
     */
    transformCertInfo(certinfo) {
        let findings = [];

        if (certinfo == null) {
            // TODO
        } else if (certinfo.error_message != null) {
            // add error finding
            let f = Object.assign(
                {
                    attributes: {
                        error: certinfo.error_message,
                    },
                },
                FindingPrototypes.CERTINFO_ERROR
            );

            f.description = sprintf(f.description, certinfo.error_message);

            findings.push(this.buildFinding(f));
        } else {
            // add ordinary findings

            // check for Must-Staple extension
            if (certinfo.certificate_has_must_staple_extension) {
                let f = Object.assign({}, FindingPrototypes.CERTINFO_HAS_MUST_STAPLE_EXTENSION);
                findings.push(this.buildFinding(f));
            }

            // check for SCTS count
            if (
                certinfo.certificate_included_scts_count != null &&
                certinfo.certificate_included_scts_count != 0
            ) {
                let f = Object.assign(
                    {
                        attributes: {
                            scts_count: certinfo.certificate_included_scts_count,
                        },
                    },
                    FindingPrototypes.CERTINFO_INCLUDES_SCTS_COUNT
                );

                f.description = sprintf(f.description, certinfo.certificate_included_scts_count);

                findings.push(this.buildFinding(f));
            }

            // check for anchor in certificate chain
            if (!certinfo.has_anchor_in_certificate_chain) {
                let f = Object.assign(
                    {},
                    FindingPrototypes.CERTINFO_NO_ANCHOR_IN_CERTIFICATE_CHAIN
                );
                findings.push(this.buildFinding(f));
            }

            // check for SHA1 in certificate chain
            if (certinfo.has_sha1_in_certificate_chain) {
                let f = Object.assign({}, FindingPrototypes.CERTINFO_SHA1_IN_CERTIFICATE_CHAIN);
                findings.push(this.buildFinding(f));
            }

            // check for valid certificate chain order
            if (!certinfo.is_certificate_chain_order_valid) {
                let f = Object.assign({}, FindingPrototypes.CERTINFO_CHAIN_ORDER_INVALID);
                findings.push(this.buildFinding(f));
            }

            // check if certificate is verified as 'extended validation'
            if (!certinfo.is_leaf_certificate_ev) {
                let f = Object.assign({}, FindingPrototypes.CERTINFO_NOT_EV);
                findings.push(this.buildFinding(f));
            }

            // check if an OCSP response was received
            if (certinfo.ocsp_response == null) {
                let f = Object.assign({}, FindingPrototypes.CERTINFO_NO_OCSP_RESPONSE);
                findings.push(this.buildFinding(f));
            } else {
                // check if OCSP response is trusted
                if (!certinfo.is_ocsp_response_trusted) {
                    let f = Object.assign(
                        {},
                        FindingPrototypes.CERTINFO_OCSP_RESPONSE_IS_NOT_TRUSTED
                    );
                    findings.push(this.buildFinding(f));
                }
            }

            // check if a path validation error occurred
            if (certinfo.path_validation_error_list != null) {
                for (const path_validation_error of certinfo.path_validation_error_list) {
                    let f = Object.assign(
                        {
                            attributes: {
                                error: path_validation_error.error_message,
                            },
                        },
                        FindingPrototypes.CERTINFO_HAS_PATH_VALIDATION_ERROR
                    );

                    f.description = sprintf(f.description, path_validation_error.error_message);

                    findings.push(this.buildFinding(f));
                }
            }

            // check if certificate will be distrusted
            if (certinfo.symantec_distrust_timeline != null) {
                let f = Object.assign(
                    {
                        attributes: {
                            distrust_timeline: certinfo.symantec_distrust_timeline,
                        },
                    },
                    FindingPrototypes.CERTINFO_WILL_BE_DISTRUSTED
                );

                f.description = sprintf(f.description, certinfo.symantec_distrust_timeline);

                findings.push(this.buildFinding(f));
            }
        }

        return findings;
    }

    /**
     * Transforms SSLyze `compression` data
     */
    transformCompression(compression) {
        let findings = [];

        if (compression == null) {
            // TODO
        }
        // check for exposed compression
        else if (compression.compression_name != null) {
            let f = Object.assign(
                {
                    attributes: {
                        name: compression.compression_name,
                    },
                },
                FindingPrototypes.COMPRESSION_METHOD_EXPOSED
            );

            f.description = sprintf(f.description, compression.compression_name);

            findings.push(this.buildFinding(f));
        }

        return findings;
    }

    /**
     * Transforms SSLyze `fallback` data
     */
    transformFallback(fallback) {
        let findings = [];

        if (fallback == null) {
            // TODO
        }
        // check for SCSV fallback support
        else if (!fallback.supports_fallback_scsv) {
            let f = Object.assign({}, FindingPrototypes.FALLBACK_NO_SCSV_SUPPORT);
            findings.push(this.buildFinding(f));
        }

        return findings;
    }

    /**
     * Transforms SSLyze `heartbleed` data
     */
    transformHeartbleed(heartbleed) {
        let findings = [];

        if (heartbleed == null) {
            // TODO
        }
        // check for Heartbleed vulnerability
        else if (heartbleed.is_vulnerable_to_heartbleed) {
            let f = Object.assign({}, FindingPrototypes.HEARTBLEED_VULNERABLE);
            findings.push(this.buildFinding(f));
        }

        return findings;
    }

    /**
     * Transforms SSLyze `openssl_ccs` data
     */
    transformCCS(ccs) {
        let findings = [];

        if (ccs == null) {
            // TODO
        }
        // check for CCS vulnerability
        else if (ccs.is_vulnerable_to_ccs_injection) {
            let f = Object.assign({}, FindingPrototypes.CCS_VULNERABLE);
            findings.push(this.buildFinding(f));
        }

        return findings;
    }

    /**
     * Transforms SSLyze `reneg` data
     */
    transformReneg(reneg) {
        let findings = [];

        if (reneg == null) {
            // TODO
        } else {
            // check if server accepts client renegotiation
            if (reneg.accepts_client_renegotiation) {
                let f = Object.assign({}, FindingPrototypes.RENEG_ACCEPTED);
                findings.push(this.buildFinding(f));
            }

            // check if server supports secure renegotiation
            if (!reneg.supports_secure_renegotiation) {
                let f = Object.assign({}, FindingPrototypes.RENEG_NO_SECURE_SUPPORT);
                findings.push(this.buildFinding(f));
            }
        }

        return findings;
    }

    /**
     * Transforms SSLyze `resum` data
     */
    transformResum(resum) {
        let findings = [];

        if (resum == null) {
            // TODO
        } else if (
            resum.ticket_resumption_exception != null ||
            resum.ticket_resumption_error != null
        ) {
            // add error findings

            if (resum.ticket_resumption_exception != null) {
                let f = Object.assign(
                    {
                        attributes: {
                            error: resum.ticket_resumption_exception,
                        },
                    },
                    FindingPrototypes.RESUM_ERROR
                );

                f.description = sprintf(f.description, resum.ticket_resumption_exception);

                findings.push(this.buildFinding(f));
            }

            if (resum.ticket_resumption_error != null) {
                let f = Object.assign(
                    {
                        attributes: {
                            error: resum.ticket_resumption_error,
                        },
                    },
                    FindingPrototypes.RESUM_ERROR
                );

                f.description = sprintf(f.description, resum.ticket_resumption_error);

                findings.push(this.buildFinding(f));
            }
        } else {
            // add ordinary findings

            // check if ticket resumption supported
            if (resum.is_ticket_resumption_supported) {
                let f = Object.assign({}, FindingPrototypes.RESUM_TICKET_RESUMPTION_SUPPORTED);
                findings.push(this.buildFinding(f));
            } else {
                let f = Object.assign({}, FindingPrototypes.RESUM_TICKET_RESUMPTION_UNSUPPORTED);
                findings.push(this.buildFinding(f));
            }

            // check if there are successful session resumptions
            if (resum.successful_resumptions_nb > 0) {
                let f = Object.assign({}, FindingPrototypes.RESUM_SUCCEEDED);
                findings.push(this.buildFinding(f));
            }

            // check if there are failed session resumptions
            if (resum.failed_resumptions_nb > 0) {
                let f = Object.assign(
                    {
                        attributes: {
                            error: resum.ticket_resumption_failed_reason,
                        },
                    },
                    FindingPrototypes.RESUM_FAILED
                );

                findings.push(this.buildFinding(f));
            }
        }

        return findings;
    }

    /**
     * Transforms SSLyze `robot` data
     */
    transformRobot(robot) {
        let findings = [];

        if (robot == null) {
            // TODO
        }
        // check for ROBOT vulnerability
        else if (
            'VULNERABLE_WEAK_ORACLE' == robot.robot_result_enum ||
            'VULNERABLE_STRONG_ORACLE' == robot.robot_result_enum
        ) {
            let f = Object.assign({}, FindingPrototypes.ROBOT_VULNERABLE);
            findings.push(this.buildFinding(f));
        } else if ('UNKNOWN_INCONSISTENT_RESULTS' == robot.robot_result_enum) {
            let f = Object.assign({}, FindingPrototypes.ROBOT_PROBABLY_VULNERABLE);
            findings.push(this.buildFinding(f));
        }

        return findings;
    }

    /**
     * Transforms SSLyze `sslv2` data
     */
    transformSSLv2(sslv2) {
        return this.transformProtocol(
            sslv2,
            FindingPrototypes.SSLV2_SUPPORTED,
            FindingPrototypes.SSLV2_ERROR
        );
    }

    /**
     * Transforms SSLyze `sslv3` data
     */
    transformSSLv3(sslv3) {
        return this.transformProtocol(
            sslv3,
            FindingPrototypes.SSLV3_SUPPORTED,
            FindingPrototypes.SSLV3_ERROR
        );
    }

    /**
     * Transforms SSLyze `tlsv1` data
     */
    transformTLSv1(tlsv1) {
        return this.transformProtocol(
            tlsv1,
            FindingPrototypes.TLSV1_SUPPORTED,
            FindingPrototypes.TLSV1_ERROR
        );
    }

    /**
     * Transforms SSLyze `tlsv1_1` data
     */
    transformTLSv1_1(tlsv1_1) {
        return this.transformProtocol(
            tlsv1_1,
            FindingPrototypes.TLSV1_1_SUPPORTED,
            FindingPrototypes.TLSV1_1_ERROR
        );
    }

    /**
     * Transforms SSLyze `tlsv1_2` data
     */
    transformTLSv1_2(tlsv1_2) {
        return this.transformProtocol(
            tlsv1_2,
            FindingPrototypes.TLSV1_2_SUPPORTED,
            FindingPrototypes.TLSV1_2_ERROR
        );
    }

    /**
     * Transforms SSLyze `tlsv1_3` data
     */
    transformTLSv1_3(tlsv1_3) {
        return this.transformProtocol(
            tlsv1_3,
            FindingPrototypes.TLSV1_3_SUPPORTED,
            FindingPrototypes.TLSV1_3_ERROR
        );
    }

    /**
     * Transforms generic protocol data
     */
    transformProtocol(protocol, supportedFinding, errorFinding) {
        let findings = [];

        if (protocol == null) {
            // TODO
        } else {
            // check if this protocol is supported
            if (protocol.accepted_cipher_list != null && protocol.accepted_cipher_list.length > 0) {
                let f = Object.assign({}, supportedFinding);
                findings.push(this.buildFinding(f));
            }

            // check for errors
            if (protocol.errored_cipher_list != null) {
                for (const errored_cipher of protocol.errored_cipher_list) {
                    let f = Object.assign(
                        {
                            attributes: {
                                cipher: errored_cipher.name,
                                error: errored_cipher.error_message,
                            },
                        },
                        errorFinding
                    );
                    findings.push(this.buildFinding(f));
                }
            }
        }

        return findings;
    }

    /**
     * Builds a finding from the given data.
     * @param {*} f finding prototype
     */
    buildFinding(f) {
        return {
            id: uuid(),
            name: f.name,
            description: f.description,
            osi_layer: f.osi_layer,
            reference: null,
            severity: f.severity,
            attributes: f.attributes,
            hint: null,
            category: f.category,
            location: `https://${this.data.server_info.hostname}:${this.data.server_info.port}`,
        };
    }
}

/**
 * Transforms the SSLyze result into an SCB finding
 *
 * @param {*} res SSLyze result
 */
function transform(res) {
    let findings = [];

    for (const target of res.accepted_targets) {
        findings = findings.concat(new FindingBuilder(target).transformData());
    }

    return findings;
}

/**
 * Combines results from multiple SSLyze scans and joins them into one data structure
 */
function joinResults(results) {
    const findings = _.flatMap(results, result => result.findings);
    const rawFindings = _.map(results, result => result.raw);

    return {
        result: findings,
        raw: rawFindings,
    };
}

/**
 * Main worker method
 * @param {*} targets array or space seperated list of target hosts
 */
async function worker(targets) {
    const results = [];
    console.log(`SCANNING ${targets.length} locations`);
    for (const { location, attributes } of targets) {
        try {
            const parameter = _.get(attributes, ['SSLYZE_PARAMETER'], '');

            console.log(`SCANNING location: ${location}, parameters:${parameter}`);
            const { res, raw } = await sslscan.scanTarget(location, parameter);
            //console.log('res: ' + res);
            const result = transform(res);

            results.push({ findings: result, raw: raw });
        } catch (err) {
            throw new Error('Failed to execute SSLyze scan.');
        }
    }

    return joinResults(results);
}

module.exports.transform = transform;
module.exports.worker = worker;
