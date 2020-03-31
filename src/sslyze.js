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
    SERVER_INFO: 'TLS Server Information',
    UNSECURE: 'Unsecure TLS Version',
    HEARTBLEED: 'Heratbleed TLS Vulnerability',
    ROBOT: 'ROBOT TLS Vulnerability',
    CCS: 'CCS TLS Vulnerability',
    NOT_TRUSTED: 'TLS Cert Not Trusted',
});

function getAllSupportedTls(commandsResults) {
    let all = [];

    for (const key in commandsResults) {
        if (commandsResults.hasOwnProperty(key)) {
            const element = commandsResults[key];
            if (element.accepted_cipher_suites != null) {
                all.push(element.tls_version_used);
            }
        }
    }

    return all;
}

function getAllAcceptedCipherSuites(commandsResults) {
    let all = [];

    for (const key in commandsResults) {
        if (commandsResults.hasOwnProperty(key)) {
            const element = commandsResults[key];
            if (element.accepted_cipher_suites != null) {
                for (const key in element.accepted_cipher_suites) {
                    if (object.hasOwnProperty(key)) {
                        const element = object[key];
                        all.push(element.cipher_suite.openssl_name);
                    }
                }
            }
        }
    }

    return all;
}

/**
 * Transforms unsecure SSLv2, SSLv3 & TLSv1.0
 */
function transformUnsecure(res, inf) {
    return {
        id: uuid(),
        name: 'Unsecure TLS Version',
        description: 'The server uses outdated or unsecure tls versions.',
        category: FindingCategory.UNSECURE,
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.MEDIUM,
        hint: 'Upgrade to a higher tls version.',
        reference: null,
        location: inf.network_configuration.tls_server_name_indication,
        attributes: {
            hostname: inf.server_location.hostname,
            ip: inf.server_location.ip_address,
            unsecure_tls_versions: getAllSupportedTls(res).filter(
                e => e == 'TLS_1_0' || e == 'SSL_2_0' || e == 'SSL_3_0'
            ),
            ssl_2_0_cipher_suites: res.ssl_2_0_cipher_suites.filter(
                e => e != res.ssl_2_0_cipher_suites.rejected_cipher_suites
            ),
            ssl_3_0_cipher_suites: res.ssl_3_0_cipher_suites.filter(
                e => e != res.ssl_2_0_cipher_suites.rejected_cipher_suites
            ),
            tls_1_0_cipher_suites: res.tls_1_0_cipher_suites.filter(
                e => e != res.ssl_2_0_cipher_suites.rejected_cipher_suites
            ),
        },
    };
}

/**
 * Transforms heartbleed vulnerability findings
 */
function transformHeartbleed(inf) {
    return {
        id: uuid(),
        name: 'Vulnerable to Heartbleed',
        description: 'The server is vulnerable to the Heartbleed attack.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.HIGH,
        category: FindingCategory.HEARTBLEED,
        hint: null,
        reference: null,
        location: inf.network_configuration.tls_server_name_indication,
        attributes: {
            hostname: inf.server_location.hostname,
            ip: inf.server_location.ip_address,
        },
    };
}

/**
 * Transforms robot vulnerability findings
 */
function transformRobot(inf, sure) {
    return {
        id: uuid(),
        name: sure ? 'Vulnerable to ROBOT attack' : 'Probably vulnerable to ROBOT attack',
        description: sure
            ? 'The server is vulnerable to the "Return Of Bleichenbacher\'s Oracle Threat".'
            : 'The server may be vulnerable to the "Return Of Bleichenbacher\'s Oracle Threat". However, the results were inconsistent.',
        osi_layer: OsiLayer.PRESENTATION,
        severity: sure ? Severity.HIGH : Severity.MEDIUM,
        category: FindingCategory.ROBOT,
        hint: null,
        reference: null,
        location: inf.network_configuration.tls_server_name_indication,
        attributes: {
            hostname: inf.server_location.hostname,
            ip: inf.server_location.ip_address,
        },
    };
}

/**
 * Transforms tls certificate findings
 */
function transformCertInfo(res, inf) {
    const certPrototypes = Object.freeze({
        // Certificate info findings
        CERTINFO_CERTIFICATE_NOT_TRUSTED: {
            name: 'Certificate is not trusted',
            description:
                'At least one chain certificate is not trusted using the supplied trust store %s. Validation result: %s',
            osi_layer: OsiLayer.PRESENTATION,
            severity: Severity.MEDIUM,
            category: FindingCategory.CERT_INFO,
        },
        CERTINFO_ANCHOR_IN_CERTIFICATE_CHAIN: {
            name: 'Anchor certificate sent',
            description: 'Received certificate chain contains the anchor certificate.',
            osi_layer: OsiLayer.PRESENTATION,
            severity: Severity.LOW,
            category: FindingCategory.CERT_INFO,
        },
        CERTINFO_SHA1_IN_CERTIFICATE_CHAIN: {
            name: 'SHA1 in certificate chain',
            description:
                'Some of the leaf or intermediate certificates are signed using the SHA-1 algorithm.',
            osi_layer: OsiLayer.PRESENTATION,
            severity: Severity.HIGH,
            category: FindingCategory.CERT_INFO,
        },
        CERTINFO_CHAIN_ORDER_INVALID: {
            name: 'Chain order invalid',
            description: 'The chain order sent by the server is invalid.',
            osi_layer: OsiLayer.PRESENTATION,
            severity: Severity.LOW,
            category: FindingCategory.CERT_INFO,
        },
        CERTINFO_OCSP_RESPONSE_IS_NOT_TRUSTED: {
            name: 'OCSP response not trusted',
            description:
                'The server sent an OCSP response which is not trusted using the Mozilla trust store.',
            osi_layer: OsiLayer.PRESENTATION,
            severity: Severity.MEDIUM,
            category: FindingCategory.CERT_INFO,
        },
        CERTINFO_HAS_PATH_VALIDATION_ERROR: {
            name: 'Certificate chain validation error',
            description:
                "An error occurred while attempting to validate the server's certificate chain: %s", // eslint-disable-line
            osi_layer: OsiLayer.PRESENTATION,
            severity: Severity.MEDIUM,
            category: FindingCategory.CERT_INFO,
        },
        CERTINFO_WILL_BE_DISTRUSTED: {
            name: 'Certificate will be distrusted',
            description:
                'The certificate was issued by one of the Symantec Legacy CAs and will be distrusted in Chrome and Firefox.',
            osi_layer: OsiLayer.PRESENTATION,
            severity: Severity.LOW,
            category: FindingCategory.CERT_INFO,
        },
        BASIS: {
            id: uuid(),
            name: null,
            description: null,
            osi_layer: null,
            severity: null,
            category: null,
            hint: null,
            reference: null,
            location: inf.network_configuration.tls_server_name_indication,
            attributes: {
                hostname: inf.server_location.hostname,
                ip: inf.server_location.ip_address,
            },
        },
    });

    let certinfo = res.certificate_info;
    let findings = [];

    if (certinfo.path_validation_result_list != null) {
        for (const path_validation_result of certinfo.path_validation_results) {
            if (path_validation_result.openssl_error_string === null) {
                continue;
            }

            let f = Object.assign(
                certPrototypes.BASIS,
                {
                    attributes: {
                        error: path_validation_result.openssl_error_string,
                        trust_store: `${path_validation_result.trust_store.name} (${path_validation_result.trust_store.path})`,
                    },
                },
                certPrototypes.CERTINFO_CERTIFICATE_NOT_TRUSTED
            );

            f.description = sprintf(
                f.description,
                path_validation_result.trust_store.name,
                path_validation_result.openssl_error_string
            );

            findings.push(f);
        }
    }

    // check for Must-Staple extension
    if (!certinfo.leaf_certificate_has_must_staple_extension) {
        let f = Object.assign(
            certPrototypes.BASIS,
            certPrototypes.CERTINFO_MUST_STAPLE_UNSUPPORTED
        );
        findings.push(f);
    }

    // check for SCTS count
    if (
        certinfo.leaf_certificate_signed_certificate_timestamps_count != null &&
        certinfo.leaf_certificate_signed_certificate_timestamps_count != 0
    ) {
        let f = Object.assign(
            certPrototypes.BASIS,
            {
                attributes: {
                    scts_count: certinfo.leaf_certificate_signed_certificate_timestamps_count,
                },
            },
            certPrototypes.CERTINFO_INCLUDES_SCTS_COUNT
        );

        f.description = sprintf(
            f.description,
            certinfo.leaf_certificate_signed_certificate_timestamps_count
        );

        findings.push(f);
    }

    // check for anchor in certificate chain
    if (certinfo.received_chain_contains_anchor_certificate) {
        let f = Object.assign(
            certPrototypes.BASIS,
            certPrototypes.CERTINFO_ANCHOR_IN_CERTIFICATE_CHAIN
        );
        findings.push(f);
    }

    // check for SHA1 in certificate chain
    if (certinfo.verified_chain_has_sha1_signature) {
        let f = Object.assign(
            certPrototypes.BASIS,
            certPrototypes.CERTINFO_SHA1_IN_CERTIFICATE_CHAIN
        );
        findings.push(f);
    }

    // check for valid certificate chain order
    if (!certinfo.received_chain_has_valid_order) {
        let f = Object.assign(certPrototypes.BASIS, certPrototypes.CERTINFO_CHAIN_ORDER_INVALID);
        findings.push(f);
    }

    // check if certificate is verified as 'extended validation'
    if (!certinfo.leaf_certificate_is_ev) {
        let f = Object.assign(certPrototypes.BASIS, certPrototypes.CERTINFO_NOT_EV);
        findings.push(f);
    }

    // check if an OCSP response was received
    if (certinfo.ocsp_response == null) {
        let f = Object.assign(certPrototypes.BASIS, certPrototypes.CERTINFO_NO_OCSP_RESPONSE);
        findings.push(f);
    } else {
        // check if OCSP response is trusted
        if (!certinfo.ocsp_response_is_trusted) {
            let f = Object.assign(
                certPrototypes.BASIS,
                certPrototypes.CERTINFO_OCSP_RESPONSE_IS_NOT_TRUSTED
            );
            findings.push(f);
        }
    }

    // check if a path validation error occurred
    if (certinfo.path_validation_error_list != null) {
        for (const path_validation_error of certinfo.path_validation_error_list) {
            let f = Object.assign(
                certPrototypes.BASIS,
                {
                    attributes: {
                        error: path_validation_error.error_message,
                    },
                },
                certPrototypes.CERTINFO_HAS_PATH_VALIDATION_ERROR
            );

            f.description = sprintf(f.description, path_validation_error.error_message);

            findings.push(f);
        }
    }

    // check if certificate will be distrusted
    if (certinfo.verified_chain_has_legacy_symantec_anchor == true) {
        let f = Object.assign(certPrototypes.BASIS, certPrototypes.CERTINFO_WILL_BE_DISTRUSTED);

        f.description = sprintf(f.description, certinfo.symantec_distrust_timeline);

        findings.push(f);
    }

    return findings;
}

/**
 * Transforms robot vulnerability findings
 */
function transformCCS(inf) {
    return {
        id: uuid(),
        name: 'Vulnerable to CCS injection',
        description: "The server is vulnerable to OpenSSL's CCS injection issue.", // eslint-disable-line
        osi_layer: OsiLayer.PRESENTATION,
        severity: Severity.HIGH,
        category: FindingCategory.CCS,
        hint: null,
        reference: null,
        location: inf.network_configuration.tls_server_name_indication,
        attributes: {
            hostname: inf.server_location.hostname,
            ip: inf.server_location.ip_address,
        },
    };
}

/**
 * Transforms the SSLyze result into an SCB finding
 *
 * @param {*} res SSLyze result
 */
function transform(res) {
    let findings = [];

    if (res.server_connectivity_errors != null) {
        let serverInfo = res.server_scan_results.server_info;
        let commandsResults = res.server_scan_results.scan_commands_results;

        findings.push({
            id: uuid(),
            name: FindingCategory.SERVER_INFO,
            description: null,
            category: FindingCategory.SERVER_INFO,
            osi_layer: OsiLayer.PRESENTATION,
            severity: Severity.INFORMATIONAL,
            hint: null,
            reference: null,
            location: serverInfo.network_configuration.tls_server_name_indication,
            attributes: {
                hostname: serverInfo.server_location.hostname,
                ip: serverInfo.server_location.ip_address,
                client_authentication_credentials:
                    serverInfo.network_configuration.tls_client_auth_credentials,
                opportunistic_tls: serverInfo.network_configuration.tls_opportunistic_encryption,
                highest_tls_version_supported:
                    serverInfo.tls_probing_result.highest_tls_version_supported,
                cipher_suite: serverInfo.tls_probing_result.cipher_suite_supported,
                all_supported_tls_version: getAllSupportedTls(commandsResults),
                all_accepted_cipher_suites: getAllAcceptedCipherSuites(commandsResults),
            },
        });

        // Unsecure tls versions
        if (
            commandsResults.ssl_2_0_ciphersuites.accepted_cipher_suites != null ||
            commandsResults.ssl_3_0_ciphersuites.accepted_cipher_suites != null ||
            commandsResults.tls_1_0_ciphersuites.accepted_cipher_suites != null
        ) {
            findings.push(transformUnsecure(commandsResults, serverInfo));
        }

        if (commandsResults.heartbleed.is_vulnerable_to_heartbleed) {
            findings.push(transformHeartbleed(serverInfo));
        }

        // check for ROBOT vulnerability
        if (
            'VULNERABLE_WEAK_ORACLE' == commandsResults.robot.robot_result ||
            'VULNERABLE_STRONG_ORACLE' == commandsResults.robot.robot_result
        ) {
            findings.push(transformRobot(serverInfo, true));
        } else if ('UNKNOWN_INCONSISTENT_RESULTS' == commandsResults.robot.robot_result) {
            findings.push(transformRobot(serverInfo, false));
        }

        if (commandsResults.openssl_ccs_injection.is_vulnerable_to_ccs_injection) {
            findings.push(transformCCS(serverInfo));
        }

        if (commandsResults.certificate_info != null) {
            findings = findings.concat(transformCertInfo(commandsResults, serverInfo));
        }
    }

    return findings;
}

/**
 * Combines results from multiple SSLyze scans and joins them into one data structure
 */
function joinResults(results) {
    const findings = _.flatMap(results, result => result.findings);

    return {
        result: findings,
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
            const { res } = await sslscan.scanTarget(location, parameter);
            //console.log('res: ' + res);
            const result = transform(res);

            results.push({ findings: result });
        } catch (err) {
            console.error('Scan errored:');
            console.error(err);
            throw new Error('Failed to execute SSLyze scan.');
        }
    }

    return joinResults(results);
}

module.exports.transform = transform;
module.exports.worker = worker;
