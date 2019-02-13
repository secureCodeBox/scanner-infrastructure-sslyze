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

const { transform, worker } = require('./sslyze');
const uuid = require('uuid/v4');
const sslscan = require('../lib/sslscan');

jest.mock('../lib/sslscan');

describe('sslyze', () => {
    describe('transform', () => {
        beforeAll(() => {
            jest.mock('uuid/v4');
        });

        beforeEach(() => {
            uuid.mockClear();
        });

        afterAll(() => {
            jest.unmock('uuid/v4');
        });

        it('should transform an ordinary scan result 1', function() {
            const findings = transform({
                accepted_targets: [
                    {
                        commands_results: {
                            certinfo: {
                                certificate_chain: [
                                    {
                                        as_pem:
                                            '-----BEGIN CERTIFICATE-----\nMIIJAzCCB+ugAwIBAgIQDaKa2VJMH0/z+3Y7vlKxrDANBgkqhkiG9w0BAQsFADBw\nMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\nd3cuZGlnaWNlcnQuY29tMS8wLQYDVQQDEyZEaWdpQ2VydCBTSEEyIEhpZ2ggQXNz\ndXJhbmNlIFNlcnZlciBDQTAeFw0xODAyMjYwMDAwMDBaFw0xODA4MjUxMjAwMDBa\nMGcxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTESMBAGA1UEBxMJU3Vubnl2YWxl\nMR0wGwYDVQQKExRZYWhvbyBIb2xkaW5ncywgSW5jLjEYMBYGA1UEAwwPKi53d3cu\neWFob28uY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6mmaB9+8\nbvzKgn4LNFEc7k3E2EdSlWQgkvRYwXo8NhWGbYRtULk6HKbHV/dqTki/4GAtOrWZ\n3qaias7KtG4vtOdAVIIYk64rJRBsbylrpDFmyxP9AdHAyuFYqDYil48ZHR/+n7WT\nIF4TjCaALHCZe8YWE/9U+wnjTclbl+pnprjLsHnxJqInvHR2Eot1ldP0e52isPN3\nw6jfdZ+Yp5eZJoyLNDI98bXSQq18GufSz3DT48YZRBVR6jXxa17s14vXzZyOpZdz\n+5T6EwUrGwHRhLObDU2yT2aRmhPNcts6HcqxRwdoioHWoO8yhlrGQ223Bphd6Hz+\neLGOBygLS/gwXQIDAQABo4IFoDCCBZwwHwYDVR0jBBgwFoAUUWj/kK8CB3U8zNll\nZGKiErhZcjswHQYDVR0OBBYEFBzt54eMUWBuNbLttk+YahZ/eNI0MIICxwYDVR0R\nBIICvjCCArqCDyoud3d3LnlhaG9vLmNvbYIQYWRkLm15LnlhaG9vLmNvbYIOKi5h\nbXAueWltZy5jb22CDGF1LnlhaG9vLmNvbYIMYmUueWFob28uY29tggxici55YWhv\nby5jb22CD2NhLm15LnlhaG9vLmNvbYITY2Eucm9nZXJzLnlhaG9vLmNvbYIMY2Eu\neWFob28uY29tghBkZGwuZnAueWFob28uY29tggxkZS55YWhvby5jb22CFGVuLW1h\na3Rvb2IueWFob28uY29tghFlc3Bhbm9sLnlhaG9vLmNvbYIMZXMueWFob28uY29t\ngg9mci1iZS55YWhvby5jb22CFmZyLWNhLnJvZ2Vycy55YWhvby5jb22CEmZyb250\naWVyLnlhaG9vLmNvbYIMZnIueWFob28uY29tggxnci55YWhvby5jb22CDGhrLnlh\naG9vLmNvbYIOaHNyZC55YWhvby5jb22CF2lkZWFuZXRzZXR0ZXIueWFob28uY29t\nggxpZC55YWhvby5jb22CDGllLnlhaG9vLmNvbYIMaW4ueWFob28uY29tggxpdC55\nYWhvby5jb22CEW1ha3Rvb2IueWFob28uY29tghJtYWxheXNpYS55YWhvby5jb22C\nDG1icC55aW1nLmNvbYIMbXkueWFob28uY29tggxuei55YWhvby5jb22CDHBoLnlh\naG9vLmNvbYIMcWMueWFob28uY29tggxyby55YWhvby5jb22CDHNlLnlhaG9vLmNv\nbYIMc2cueWFob28uY29tggx0dy55YWhvby5jb22CDHVrLnlhaG9vLmNvbYIMdXMu\neWFob28uY29tghF2ZXJpem9uLnlhaG9vLmNvbYIMdm4ueWFob28uY29tgg13d3cu\neWFob28uY29tggl5YWhvby5jb22CDHphLnlhaG9vLmNvbTAOBgNVHQ8BAf8EBAMC\nBaAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMHUGA1UdHwRuMGwwNKAy\noDCGLmh0dHA6Ly9jcmwzLmRpZ2ljZXJ0LmNvbS9zaGEyLWhhLXNlcnZlci1nNi5j\ncmwwNKAyoDCGLmh0dHA6Ly9jcmw0LmRpZ2ljZXJ0LmNvbS9zaGEyLWhhLXNlcnZl\nci1nNi5jcmwwTAYDVR0gBEUwQzA3BglghkgBhv1sAQEwKjAoBggrBgEFBQcCARYc\naHR0cHM6Ly93d3cuZGlnaWNlcnQuY29tL0NQUzAIBgZngQwBAgIwgYMGCCsGAQUF\nBwEBBHcwdTAkBggrBgEFBQcwAYYYaHR0cDovL29jc3AuZGlnaWNlcnQuY29tME0G\nCCsGAQUFBzAChkFodHRwOi8vY2FjZXJ0cy5kaWdpY2VydC5jb20vRGlnaUNlcnRT\nSEEySGlnaEFzc3VyYW5jZVNlcnZlckNBLmNydDAMBgNVHRMBAf8EAjAAMIIBBQYK\nKwYBBAHWeQIEAgSB9gSB8wDxAHYAu9nfvB+KcbWTlCOXqpJ7RzhXlQqrUugakJZk\nNo4e0YUAAAFh02HjzAAABAMARzBFAiEA3sr1uZcc9b+IzY6z66Rz1yHX1ZuVYpnQ\nyTx6WEdb2pgCIGhfjRPibuJ9J3nar8U4qS3FeoXI6sElxrQfi3ct8w3OAHcAh3W/\n51l8+IxDmV+9827/Vo1HVjb/SrVgwbTq/16ggw8AAAFh02HjvgAABAMASDBGAiEA\n756cn+DnfAhzgbonXNiHvJtU+SCTho8u23bM14Nh0+MCIQC90B9AckWD5+1o91i9\nONLt8lkdtFYufg/+VH1IgOaZsTANBgkqhkiG9w0BAQsFAAOCAQEATdztspRySWON\nMwcDmLUjKdVq3LIwCQxbQfLzUQHBqmrP9kqSnPDVZn/ALDnjdRGQ4tzGkQlRfGYl\npry0ZfcDwswq6FOR2gqHI/Q+k3FB6PigUlbSVEuARg+VKYFu+B9arQrg4acqUmtf\nfIAh5iVGmWfphg2nPKjpubOfeI/XiknvJG2aEfoLIfR+CHrJ3sN4U2KYdBMhusJg\nkY7rprI1r5dNR1IdRgxO4dY+QU4cUsyeGNhRkt4TEeEsDV8UNWQ3ge1qdrwzUHew\niRrBjlru4U3ziEMzn4V/uUho88WYXOhyVavP08Kqp1XVr/YnzcWL8abPO3mc/nOE\nemkJ4OQnNQ==\n-----END CERTIFICATE-----\n',
                                        hpkp_pin: 'Zp964pqQpx94buKz5C8LxtmtQQWq2ZcWnLzrmt187go=',
                                        issuer:
                                            'countryName=US, organizationName=DigiCert Inc, organizationalUnitName=www.digicert.com, commonName=DigiCert SHA2 High Assurance Server CA',
                                        notAfter: '2018-08-25 12:00:00',
                                        notBefore: '2018-02-26 00:00:00',
                                        publicKey: {
                                            algorithm: 'RSA',
                                            exponent: '65537',
                                            size: '2048',
                                        },
                                        serialNumber: '18124256745346573412053511668818424236',
                                        signatureAlgorithm: 'sha256',
                                        subject:
                                            'countryName=US, stateOrProvinceName=CA, localityName=Sunnyvale, organizationName=Yahoo Holdings, Inc., commonName=*.www.yahoo.com',
                                        subjectAlternativeName: {
                                            DNS: [
                                                '*.www.yahoo.com',
                                                'add.my.yahoo.com',
                                                '*.amp.yimg.com',
                                                'au.yahoo.com',
                                                'be.yahoo.com',
                                                'br.yahoo.com',
                                                'ca.my.yahoo.com',
                                                'ca.rogers.yahoo.com',
                                                'ca.yahoo.com',
                                                'ddl.fp.yahoo.com',
                                                'de.yahoo.com',
                                                'en-maktoob.yahoo.com',
                                                'espanol.yahoo.com',
                                                'es.yahoo.com',
                                                'fr-be.yahoo.com',
                                                'fr-ca.rogers.yahoo.com',
                                                'frontier.yahoo.com',
                                                'fr.yahoo.com',
                                                'gr.yahoo.com',
                                                'hk.yahoo.com',
                                                'hsrd.yahoo.com',
                                                'ideanetsetter.yahoo.com',
                                                'id.yahoo.com',
                                                'ie.yahoo.com',
                                                'in.yahoo.com',
                                                'it.yahoo.com',
                                                'maktoob.yahoo.com',
                                                'malaysia.yahoo.com',
                                                'mbp.yimg.com',
                                                'my.yahoo.com',
                                                'nz.yahoo.com',
                                                'ph.yahoo.com',
                                                'qc.yahoo.com',
                                                'ro.yahoo.com',
                                                'se.yahoo.com',
                                                'sg.yahoo.com',
                                                'tw.yahoo.com',
                                                'uk.yahoo.com',
                                                'us.yahoo.com',
                                                'verizon.yahoo.com',
                                                'vn.yahoo.com',
                                                'www.yahoo.com',
                                                'yahoo.com',
                                                'za.yahoo.com',
                                            ],
                                        },
                                    },
                                    {
                                        as_pem:
                                            '-----BEGIN CERTIFICATE-----\nMIIEsTCCA5mgAwIBAgIQBOHnpNxc8vNtwCtCuF0VnzANBgkqhkiG9w0BAQsFADBs\nMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\nd3cuZGlnaWNlcnQuY29tMSswKQYDVQQDEyJEaWdpQ2VydCBIaWdoIEFzc3VyYW5j\nZSBFViBSb290IENBMB4XDTEzMTAyMjEyMDAwMFoXDTI4MTAyMjEyMDAwMFowcDEL\nMAkGA1UEBhMCVVMxFTATBgNVBAoTDERpZ2lDZXJ0IEluYzEZMBcGA1UECxMQd3d3\nLmRpZ2ljZXJ0LmNvbTEvMC0GA1UEAxMmRGlnaUNlcnQgU0hBMiBIaWdoIEFzc3Vy\nYW5jZSBTZXJ2ZXIgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC2\n4C/CJAbIbQRf1+8KZAayfSImZRauQkCbztyfn3YHPsMwVYcZuU+UDlqUH1VWtMIC\nKq/QmO4LQNfE0DtyyBSe75CxEamu0si4QzrZCwvV1ZX1QK/IHe1NnF9Xt4ZQaJn1\nitrSxwUfqJfJ3KSxgoQtxq2lnMcZgqaFD15EWCo3j/018QsIJzJa9buLnqS9UdAn\n4t07QjOjBSjEuyjMmqwrIw14xnvmXnG3Sj4I+4G3FhahnSMSTeXXkgisdaScus0X\nsh5ENWV/UyU50RwKmmMbGZJ0aAo3wsJSSMs5WqK24V3B3aAguCGikyZvFEohQcft\nbZvySC/zA/WiaJJTL17jAgMBAAGjggFJMIIBRTASBgNVHRMBAf8ECDAGAQH/AgEA\nMA4GA1UdDwEB/wQEAwIBhjAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIw\nNAYIKwYBBQUHAQEEKDAmMCQGCCsGAQUFBzABhhhodHRwOi8vb2NzcC5kaWdpY2Vy\ndC5jb20wSwYDVR0fBEQwQjBAoD6gPIY6aHR0cDovL2NybDQuZGlnaWNlcnQuY29t\nL0RpZ2lDZXJ0SGlnaEFzc3VyYW5jZUVWUm9vdENBLmNybDA9BgNVHSAENjA0MDIG\nBFUdIAAwKjAoBggrBgEFBQcCARYcaHR0cHM6Ly93d3cuZGlnaWNlcnQuY29tL0NQ\nUzAdBgNVHQ4EFgQUUWj/kK8CB3U8zNllZGKiErhZcjswHwYDVR0jBBgwFoAUsT7D\naQP4v0cB1JgmGggC72NkK8MwDQYJKoZIhvcNAQELBQADggEBABiKlYkD5m3fXPwd\naOpKj4PWUS+Na0QWnqxj9dJubISZi6qBcYRb7TROsLd5kinMLYBq8I4g4Xmk/gNH\nE+r1hspZcX30BJZr01lYPf7TMSVcGDiEo+afgv2MW5gxTs14nhr9hctJqvIni5ly\n/D6q1UEL2tU2ob8cbkdJf17ZSHwD2f2LSaCYJkJA69aSEaRkCldUxPUd1gJea6zu\nxICaEnL6VpPX/78whQYwvwt/Tv9XBZ0k7YXDK/umdaisLRbvfXknsuvCnQsH6qqF\n0wGjIChBWUMo0oHjqvbsezt3tkBigAVBRQHvFwY+3sAzm2fTYS5yh+Rp/BIAV0Ae\ncPUeybQ=\n-----END CERTIFICATE-----\n',
                                        hpkp_pin: 'k2v657xBsOVe1PQRwOsHsw3bsGT2VzIqz5K+59sNQws=',
                                        issuer:
                                            'countryName=US, organizationName=DigiCert Inc, organizationalUnitName=www.digicert.com, commonName=DigiCert High Assurance EV Root CA',
                                        notAfter: '2028-10-22 12:00:00',
                                        notBefore: '2013-10-22 12:00:00',
                                        publicKey: {
                                            algorithm: 'RSA',
                                            exponent: '65537',
                                            size: '2048',
                                        },
                                        serialNumber: '6489877074546166222510380951761917343',
                                        signatureAlgorithm: 'sha256',
                                        subject:
                                            'countryName=US, organizationName=DigiCert Inc, organizationalUnitName=www.digicert.com, commonName=DigiCert SHA2 High Assurance Server CA',
                                    },
                                ],
                                certificate_has_must_staple_extension: false,
                                certificate_included_scts_count: 2,
                                certificate_matches_hostname: true,
                                has_anchor_in_certificate_chain: true,
                                has_sha1_in_certificate_chain: true,
                                is_certificate_chain_order_valid: false,
                                is_leaf_certificate_ev: false,
                                is_ocsp_response_trusted: false,
                                ocsp_response: null,
                                ocsp_response_status: null,
                                path_validation_error_list: [
                                    {
                                        error_message: 'Test failure',
                                    },
                                ],
                                path_validation_result_list: [
                                    {
                                        is_certificate_trusted: false,
                                        trust_store: {
                                            ev_oids: [],
                                            name: 'Android',
                                            path:
                                                '/usr/local/lib/python3.6/site-packages/sslyze/plugins/utils/trust_store/pem_files/google_aosp.pem',
                                            version: '8.1.0_r9',
                                        },
                                        verify_string: 'Test failure',
                                    },
                                    {
                                        is_certificate_trusted: true,
                                        trust_store: {
                                            ev_oids: [],
                                            name: 'iOS',
                                            path:
                                                '/usr/local/lib/python3.6/site-packages/sslyze/plugins/utils/trust_store/pem_files/apple_ios.pem',
                                            version: '11',
                                        },
                                        verify_string: 'ok',
                                    },
                                ],
                                successful_trust_store: {
                                    ev_oids: [],
                                    name: 'Windows',
                                    path:
                                        '/usr/local/lib/python3.6/site-packages/sslyze/plugins/utils/trust_store/pem_files/microsoft_windows.pem',
                                    version: '2018-04-26',
                                },
                                symantec_distrust_timeline: 'SEPTEMBER_2018',
                                verified_certificate_chain: [],
                            },
                            compression: {
                                compression_name: 'some compression method',
                            },
                            fallback: {
                                supports_fallback_scsv: false,
                            },
                            heartbleed: {
                                is_vulnerable_to_heartbleed: true,
                            },
                            openssl_ccs: {
                                is_vulnerable_to_ccs_injection: true,
                            },
                            reneg: {
                                accepts_client_renegotiation: true,
                                supports_secure_renegotiation: false,
                            },
                            resum: {
                                _rate_result: {
                                    attempted_resumptions_nb: 5,
                                    errored_resumptions_list: [],
                                    failed_resumptions_nb: 5,
                                    scan_command: {},
                                    server_info: {
                                        client_auth_credentials: null,
                                        client_auth_requirement: 'DISABLED',
                                        highest_ssl_version_supported: 'TLSV1_2',
                                        hostname: 'www.yahoo.com',
                                        http_tunneling_settings: null,
                                        ip_address: '87.248.98.8',
                                        openssl_cipher_string_supported:
                                            'ECDHE-RSA-AES128-GCM-SHA256',
                                        port: 443,
                                        tls_server_name_indication: 'www.yahoo.com',
                                        tls_wrapped_protocol: 'HTTPS',
                                        xmpp_to_hostname: null,
                                    },
                                    successful_resumptions_nb: 0,
                                },
                                attempted_resumptions_nb: 5,
                                errored_resumptions_list: [],
                                failed_resumptions_nb: 4,
                                is_ticket_resumption_supported: false,
                                successful_resumptions_nb: 1,
                                ticket_resumption_error: null,
                                ticket_resumption_failed_reason: 'Test failure',
                            },
                            robot: {
                                robot_result_enum: 'UNKNOWN_INCONSISTENT_RESULTS',
                            },
                            sslv2: {
                                accepted_cipher_list: [
                                    {
                                        dh_info: {},
                                        is_anonymous: false,
                                        key_size: 1337,
                                        openssl_name: 'yolo',
                                        post_handshake_response: 'all good',
                                        ssl_version: 'some version',
                                    },
                                ],
                                errored_cipher_list: [
                                    {
                                        name: 'test1',
                                        error_message: 'Test failure 1',
                                    },
                                    {
                                        name: 'test2',
                                        error_message: 'Test failure 2',
                                    },
                                ],
                                preferred_cipher: null,
                                rejected_cipher_list: [],
                            },
                            sslv3: {
                                accepted_cipher_list: [
                                    {
                                        dh_info: {},
                                        is_anonymous: false,
                                        key_size: 1337,
                                        openssl_name: 'yolo',
                                        post_handshake_response: 'all good',
                                        ssl_version: 'some version',
                                    },
                                ],
                                errored_cipher_list: [
                                    {
                                        name: 'test1',
                                        error_message: 'Test failure 1',
                                    },
                                    {
                                        name: 'test2',
                                        error_message: 'Test failure 2',
                                    },
                                ],
                                preferred_cipher: null,
                                rejected_cipher_list: [],
                            },
                            tlsv1: {
                                accepted_cipher_list: [
                                    {
                                        dh_info: {},
                                        is_anonymous: false,
                                        key_size: 1337,
                                        openssl_name: 'yolo',
                                        post_handshake_response: 'all good',
                                        ssl_version: 'some version',
                                    },
                                ],
                                errored_cipher_list: [
                                    {
                                        name: 'test1',
                                        error_message: 'Test failure 1',
                                    },
                                    {
                                        name: 'test2',
                                        error_message: 'Test failure 2',
                                    },
                                ],
                                preferred_cipher: null,
                                rejected_cipher_list: [],
                            },
                            tlsv1_1: {
                                accepted_cipher_list: [
                                    {
                                        dh_info: {},
                                        is_anonymous: false,
                                        key_size: 1337,
                                        openssl_name: 'yolo',
                                        post_handshake_response: 'all good',
                                        ssl_version: 'some version',
                                    },
                                ],
                                errored_cipher_list: [
                                    {
                                        name: 'test1',
                                        error_message: 'Test failure 1',
                                    },
                                    {
                                        name: 'test2',
                                        error_message: 'Test failure 2',
                                    },
                                ],
                                preferred_cipher: null,
                                rejected_cipher_list: [],
                            },
                            tlsv1_2: {
                                accepted_cipher_list: [
                                    {
                                        dh_info: {},
                                        is_anonymous: false,
                                        key_size: 1337,
                                        openssl_name: 'yolo',
                                        post_handshake_response: 'all good',
                                        ssl_version: 'some version',
                                    },
                                ],
                                errored_cipher_list: [
                                    {
                                        name: 'test1',
                                        error_message: 'Test failure 1',
                                    },
                                    {
                                        name: 'test2',
                                        error_message: 'Test failure 2',
                                    },
                                ],
                                preferred_cipher: null,
                                rejected_cipher_list: [],
                            },
                            tlsv1_3: {
                                accepted_cipher_list: [
                                    {
                                        dh_info: {},
                                        is_anonymous: false,
                                        key_size: 1337,
                                        openssl_name: 'yolo',
                                        post_handshake_response: 'all good',
                                        ssl_version: 'some version',
                                    },
                                ],
                                errored_cipher_list: [
                                    {
                                        name: 'test1',
                                        error_message: 'Test failure 1',
                                    },
                                    {
                                        name: 'test2',
                                        error_message: 'Test failure 2',
                                    },
                                ],
                                preferred_cipher: null,
                                rejected_cipher_list: [],
                            },
                        },
                        server_info: {
                            client_auth_credentials: null,
                            client_auth_requirement: 'DISABLED',
                            highest_ssl_version_supported: 'TLSV1_2',
                            hostname: 'www.yahoo.com',
                            http_tunneling_settings: null,
                            ip_address: '87.248.98.8',
                            openssl_cipher_string_supported: 'ECDHE-RSA-AES128-GCM-SHA256',
                            port: 443,
                            tls_server_name_indication: 'www.yahoo.com',
                            tls_wrapped_protocol: 'HTTPS',
                            xmpp_to_hostname: null,
                        },
                    },
                ],
                invalid_targets: [],
                sslyze_url: 'https://github.com/nabla-c0d3/sslyze',
                sslyze_version: '1.4.1',
                total_scan_time: '6.826319217681885',
            });
            //console.log(JSON.stringify(findings, null, 2));
            // CERTINFO_CERTIFICATE_NOT_TRUSTED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Certificate is not trusted',
                description:
                    'At least one chain certificate is not trusted using the supplied trust store Android. Validation result: Test failure',
                category: 'Certificate info',
                osi_layer: 'PRESENTATION',
                severity: 'MEDIUM',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    error: 'Test failure',
                    trust_store:
                        'Android (/usr/local/lib/python3.6/site-packages/sslyze/plugins/utils/trust_store/pem_files/google_aosp.pem)',
                },
            });
            // CERTINFO_MUST_STAPLE_UNSUPPORTED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Must-Staple unsupported',
                description:
                    'Leaf certificate does not support OCSP Must-Staple extension as defined in RFC 6066.',
                category: 'Certificate info',
                osi_layer: 'PRESENTATION',
                severity: 'INFORMATIONAL',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // CERTINFO_INCLUDES_SCTS_COUNT
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Certificate includes SCTS count',
                description:
                    'The number of Signed Certificate Timestamps (SCTs) for Certificate Transparency is embedded in the leaf certificate. Its value is 2.',
                category: 'Certificate info',
                osi_layer: 'PRESENTATION',
                severity: 'INFORMATIONAL',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    scts_count: 2,
                },
            });
            // CERTINFO_ANCHOR_IN_CERTIFICATE_CHAIN
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Anchor certificate sent',
                description: 'Received certificate chain contains the anchor certificate.',
                category: 'Certificate info',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // CERTINFO_SHA1_IN_CERTIFICATE_CHAIN
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'SHA1 in certificate chain',
                description:
                    'Some of the leaf or intermediate certificates are signed using the SHA-1 algorithm.',
                category: 'Certificate info',
                osi_layer: 'PRESENTATION',
                severity: 'HIGH',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // CERTINFO_CHAIN_ORDER_INVALID
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Chain order invalid',
                description: 'The chain order sent by the server is invalid.',
                category: 'Certificate info',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // CERTINFO_NOT_EV
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'No extended validation certificate',
                description:
                    'The certificate has not been validated by the certificate authority according to the standardized set of requirements set out in the CA/Browser Forum Extended Validation Certificate Guidelines. (https://wiki.mozilla.org/EV)',
                category: 'Certificate info',
                osi_layer: 'PRESENTATION',
                severity: 'INFORMATIONAL',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // CERTINFO_NO_OCSP_RESPONSE
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'No OCSP response',
                description: 'The server did not send an OCSP response.',
                category: 'Certificate info',
                osi_layer: 'PRESENTATION',
                severity: 'INFORMATIONAL',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // CERTINFO_HAS_PATH_VALIDATION_ERROR
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Certificate chain validation error',
                description:
                    "An error occurred while attempting to validate the server's certificate chain: Test failure", // eslint-disable-line
                category: 'Certificate info',
                osi_layer: 'PRESENTATION',
                severity: 'MEDIUM',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    error: 'Test failure',
                },
            });
            // CERTINFO_WILL_BE_DISTRUSTED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Certificate will be distrusted',
                description:
                    'The certificate was issued by one of the Symantec CAs and will be distrusted in Chrome and Firefox in SEPTEMBER_2018.',
                category: 'Certificate info',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    distrust_timeline: 'SEPTEMBER_2018',
                },
            });
            // COMPRESSION_METHOD_EXPOSED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Compression method exposed',
                description:
                    'The server supports the compression algorithm some compression method.',
                category: 'Compression',
                osi_layer: 'PRESENTATION',
                severity: 'INFORMATIONAL',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    name: 'some compression method',
                },
            });
            // FALLBACK_NO_SCSV_SUPPORT
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'No SCSV fallback support',
                description:
                    'The server does not support the SCSV cipher suite which would prevent downgrade attacks if it was supported.',
                category: 'Fallback',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // HEARTBLEED_VULNERABLE
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Vulnerable to Heartbleed',
                description: 'The server is vulnerable to the Heartbleed attack.',
                category: 'Heartbleed',
                osi_layer: 'PRESENTATION',
                severity: 'HIGH',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // CCS_VULNERABLE
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Vulnerable to CCS injection',
                description: "The server is vulnerable to OpenSSL's CCS injection issue.", // eslint-disable-line
                category: 'CCS',
                osi_layer: 'PRESENTATION',
                severity: 'HIGH',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // CCS_VULNERABLE
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Vulnerable to CCS injection',
                description: "The server is vulnerable to OpenSSL's CCS injection issue.", // eslint-disable-line
                category: 'CCS',
                osi_layer: 'PRESENTATION',
                severity: 'HIGH',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // RENEG_ACCEPTED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Accepts client renegotiation',
                description: 'The server honors client-initiated renegotiation attempts.',
                category: 'Renegotiation',
                osi_layer: 'PRESENTATION',
                severity: 'HIGH',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // RENEG_NO_SECURE_SUPPORT
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'No support for secure renegotiation',
                description: 'The server does not support secure renegotiation.',
                category: 'Renegotiation',
                osi_layer: 'PRESENTATION',
                severity: 'HIGH',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // RESUM_TICKET_RESUMPTION_UNSUPPORTED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Ticket resumption not supported',
                description:
                    'The server does not support session resumption through ticket encapsulation.',
                category: 'Resumption',
                osi_layer: 'PRESENTATION',
                severity: 'INFORMATIONAL',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // RESUM_SUCCEEDED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Session resumption succeeded',
                description: 'At least one session resumption succeeded.',
                category: 'Resumption',
                osi_layer: 'PRESENTATION',
                severity: 'INFORMATIONAL',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // RESUM_FAILED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Session resumption failed',
                description: 'At least one session resumption failed.',
                category: 'Resumption',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    error: 'Test failure',
                },
            });
            // ROBOT_PROBABLY_VULNERABLE
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Probably vulnerable to ROBOT attack',
                description:
                    'The server may be vulnerable to the "Return Of Bleichenbacher\'s Oracle Threat". However, the results were inconsistent.',
                category: 'Robot',
                osi_layer: 'PRESENTATION',
                severity: 'MEDIUM',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // SSLV2_SUPPORTED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'SSLv2 supported',
                description:
                    'The server supports at least one cipher suite using the SSLv2 protocol.',
                category: 'SSLv2',
                osi_layer: 'PRESENTATION',
                severity: 'INFORMATIONAL',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // SSLV2_ERROR
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'SSLv2 negotation error',
                description:
                    'At least one error occurred during negotiation using the SSLv2 protocol.',
                category: 'SSLv2',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    cipher: 'test1',
                    error: 'Test failure 1',
                },
            });
            // SSLV2_ERROR
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'SSLv2 negotation error',
                description:
                    'At least one error occurred during negotiation using the SSLv2 protocol.',
                category: 'SSLv2',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    cipher: 'test2',
                    error: 'Test failure 2',
                },
            });
            // SSLV3_SUPPORTED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'SSLv3 supported',
                description:
                    'The server supports at least one cipher suite using the SSLv3 protocol.',
                category: 'SSLv3',
                osi_layer: 'PRESENTATION',
                severity: 'INFORMATIONAL',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // SSLV3_ERROR
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'SSLv3 negotation error',
                description:
                    'At least one error occurred during negotiation using the SSLv3 protocol.',
                category: 'SSLv3',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    cipher: 'test1',
                    error: 'Test failure 1',
                },
            });
            // SSLV3_ERROR
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'SSLv3 negotation error',
                description:
                    'At least one error occurred during negotiation using the SSLv3 protocol.',
                category: 'SSLv3',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    cipher: 'test2',
                    error: 'Test failure 2',
                },
            });
            // TLSV1_SUPPORTED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'TLSv1 supported',
                description:
                    'The server supports at least one cipher suite using the TLSv1 protocol.',
                category: 'TLSv1',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // TLSV1_ERROR
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'TLSv1 negotation error',
                description:
                    'At least one error occurred during negotiation using the TLSv1 protocol.',
                category: 'TLSv1',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    cipher: 'test1',
                    error: 'Test failure 1',
                },
            });
            // TLSV1_ERROR
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'TLSv1 negotation error',
                description:
                    'At least one error occurred during negotiation using the TLSv1 protocol.',
                category: 'TLSv1',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    cipher: 'test2',
                    error: 'Test failure 2',
                },
            });
            // TLSV1_1_SUPPORTED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'TLSv1.1 supported',
                description:
                    'The server supports at least one cipher suite using the TLSv1.1 protocol.',
                category: 'TLSv1.1',
                osi_layer: 'PRESENTATION',
                severity: 'INFORMATIONAL',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // TLSV1_1_ERROR
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'TLSv1.1 negotation error',
                description:
                    'At least one error occurred during negotiation using the TLSv1.1 protocol.',
                category: 'TLSv1.1',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    cipher: 'test1',
                    error: 'Test failure 1',
                },
            });
            // TLSV1_1_ERROR
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'TLSv1.1 negotation error',
                description:
                    'At least one error occurred during negotiation using the TLSv1.1 protocol.',
                category: 'TLSv1.1',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    cipher: 'test2',
                    error: 'Test failure 2',
                },
            });
            // TLSV1_2_SUPPORTED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'TLSv1.2 supported',
                description:
                    'The server supports at least one cipher suite using the TLSv1.2 protocol.',
                category: 'TLSv1.2',
                osi_layer: 'PRESENTATION',
                severity: 'INFORMATIONAL',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // TLSV1_2_ERROR
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'TLSv1.2 negotation error',
                description:
                    'At least one error occurred during negotiation using the TLSv1.2 protocol.',
                category: 'TLSv1.2',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    cipher: 'test1',
                    error: 'Test failure 1',
                },
            });
            // TLSV1_2_ERROR
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'TLSv1.2 negotation error',
                description:
                    'At least one error occurred during negotiation using the TLSv1.2 protocol.',
                category: 'TLSv1.2',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    cipher: 'test2',
                    error: 'Test failure 2',
                },
            });
            // TLSV1_3_SUPPORTED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'TLSv1.3 supported',
                description:
                    'The server supports at least one cipher suite using the TLSv1.3 protocol.',
                category: 'TLSv1.3',
                osi_layer: 'PRESENTATION',
                severity: 'INFORMATIONAL',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // TLSV1_3_ERROR
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'TLSv1.3 negotation error',
                description:
                    'At least one error occurred during negotiation using the TLSv1.3 protocol.',
                category: 'TLSv1.3',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    cipher: 'test1',
                    error: 'Test failure 1',
                },
            });
            // TLSV1_3_ERROR
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'TLSv1.3 negotation error',
                description:
                    'At least one error occurred during negotiation using the TLSv1.3 protocol.',
                category: 'TLSv1.3',
                osi_layer: 'PRESENTATION',
                severity: 'LOW',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    cipher: 'test2',
                    error: 'Test failure 2',
                },
            });
        });

        it('should transform an ordinary scan result 2', function() {
            const findings = transform({
                accepted_targets: [
                    {
                        commands_results: {
                            certinfo: {
                                certificate_chain: [
                                    {
                                        as_pem:
                                            '-----BEGIN CERTIFICATE-----\nMIIJAzCCB+ugAwIBAgIQDaKa2VJMH0/z+3Y7vlKxrDANBgkqhkiG9w0BAQsFADBw\nMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\nd3cuZGlnaWNlcnQuY29tMS8wLQYDVQQDEyZEaWdpQ2VydCBTSEEyIEhpZ2ggQXNz\ndXJhbmNlIFNlcnZlciBDQTAeFw0xODAyMjYwMDAwMDBaFw0xODA4MjUxMjAwMDBa\nMGcxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTESMBAGA1UEBxMJU3Vubnl2YWxl\nMR0wGwYDVQQKExRZYWhvbyBIb2xkaW5ncywgSW5jLjEYMBYGA1UEAwwPKi53d3cu\neWFob28uY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6mmaB9+8\nbvzKgn4LNFEc7k3E2EdSlWQgkvRYwXo8NhWGbYRtULk6HKbHV/dqTki/4GAtOrWZ\n3qaias7KtG4vtOdAVIIYk64rJRBsbylrpDFmyxP9AdHAyuFYqDYil48ZHR/+n7WT\nIF4TjCaALHCZe8YWE/9U+wnjTclbl+pnprjLsHnxJqInvHR2Eot1ldP0e52isPN3\nw6jfdZ+Yp5eZJoyLNDI98bXSQq18GufSz3DT48YZRBVR6jXxa17s14vXzZyOpZdz\n+5T6EwUrGwHRhLObDU2yT2aRmhPNcts6HcqxRwdoioHWoO8yhlrGQ223Bphd6Hz+\neLGOBygLS/gwXQIDAQABo4IFoDCCBZwwHwYDVR0jBBgwFoAUUWj/kK8CB3U8zNll\nZGKiErhZcjswHQYDVR0OBBYEFBzt54eMUWBuNbLttk+YahZ/eNI0MIICxwYDVR0R\nBIICvjCCArqCDyoud3d3LnlhaG9vLmNvbYIQYWRkLm15LnlhaG9vLmNvbYIOKi5h\nbXAueWltZy5jb22CDGF1LnlhaG9vLmNvbYIMYmUueWFob28uY29tggxici55YWhv\nby5jb22CD2NhLm15LnlhaG9vLmNvbYITY2Eucm9nZXJzLnlhaG9vLmNvbYIMY2Eu\neWFob28uY29tghBkZGwuZnAueWFob28uY29tggxkZS55YWhvby5jb22CFGVuLW1h\na3Rvb2IueWFob28uY29tghFlc3Bhbm9sLnlhaG9vLmNvbYIMZXMueWFob28uY29t\ngg9mci1iZS55YWhvby5jb22CFmZyLWNhLnJvZ2Vycy55YWhvby5jb22CEmZyb250\naWVyLnlhaG9vLmNvbYIMZnIueWFob28uY29tggxnci55YWhvby5jb22CDGhrLnlh\naG9vLmNvbYIOaHNyZC55YWhvby5jb22CF2lkZWFuZXRzZXR0ZXIueWFob28uY29t\nggxpZC55YWhvby5jb22CDGllLnlhaG9vLmNvbYIMaW4ueWFob28uY29tggxpdC55\nYWhvby5jb22CEW1ha3Rvb2IueWFob28uY29tghJtYWxheXNpYS55YWhvby5jb22C\nDG1icC55aW1nLmNvbYIMbXkueWFob28uY29tggxuei55YWhvby5jb22CDHBoLnlh\naG9vLmNvbYIMcWMueWFob28uY29tggxyby55YWhvby5jb22CDHNlLnlhaG9vLmNv\nbYIMc2cueWFob28uY29tggx0dy55YWhvby5jb22CDHVrLnlhaG9vLmNvbYIMdXMu\neWFob28uY29tghF2ZXJpem9uLnlhaG9vLmNvbYIMdm4ueWFob28uY29tgg13d3cu\neWFob28uY29tggl5YWhvby5jb22CDHphLnlhaG9vLmNvbTAOBgNVHQ8BAf8EBAMC\nBaAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMHUGA1UdHwRuMGwwNKAy\noDCGLmh0dHA6Ly9jcmwzLmRpZ2ljZXJ0LmNvbS9zaGEyLWhhLXNlcnZlci1nNi5j\ncmwwNKAyoDCGLmh0dHA6Ly9jcmw0LmRpZ2ljZXJ0LmNvbS9zaGEyLWhhLXNlcnZl\nci1nNi5jcmwwTAYDVR0gBEUwQzA3BglghkgBhv1sAQEwKjAoBggrBgEFBQcCARYc\naHR0cHM6Ly93d3cuZGlnaWNlcnQuY29tL0NQUzAIBgZngQwBAgIwgYMGCCsGAQUF\nBwEBBHcwdTAkBggrBgEFBQcwAYYYaHR0cDovL29jc3AuZGlnaWNlcnQuY29tME0G\nCCsGAQUFBzAChkFodHRwOi8vY2FjZXJ0cy5kaWdpY2VydC5jb20vRGlnaUNlcnRT\nSEEySGlnaEFzc3VyYW5jZVNlcnZlckNBLmNydDAMBgNVHRMBAf8EAjAAMIIBBQYK\nKwYBBAHWeQIEAgSB9gSB8wDxAHYAu9nfvB+KcbWTlCOXqpJ7RzhXlQqrUugakJZk\nNo4e0YUAAAFh02HjzAAABAMARzBFAiEA3sr1uZcc9b+IzY6z66Rz1yHX1ZuVYpnQ\nyTx6WEdb2pgCIGhfjRPibuJ9J3nar8U4qS3FeoXI6sElxrQfi3ct8w3OAHcAh3W/\n51l8+IxDmV+9827/Vo1HVjb/SrVgwbTq/16ggw8AAAFh02HjvgAABAMASDBGAiEA\n756cn+DnfAhzgbonXNiHvJtU+SCTho8u23bM14Nh0+MCIQC90B9AckWD5+1o91i9\nONLt8lkdtFYufg/+VH1IgOaZsTANBgkqhkiG9w0BAQsFAAOCAQEATdztspRySWON\nMwcDmLUjKdVq3LIwCQxbQfLzUQHBqmrP9kqSnPDVZn/ALDnjdRGQ4tzGkQlRfGYl\npry0ZfcDwswq6FOR2gqHI/Q+k3FB6PigUlbSVEuARg+VKYFu+B9arQrg4acqUmtf\nfIAh5iVGmWfphg2nPKjpubOfeI/XiknvJG2aEfoLIfR+CHrJ3sN4U2KYdBMhusJg\nkY7rprI1r5dNR1IdRgxO4dY+QU4cUsyeGNhRkt4TEeEsDV8UNWQ3ge1qdrwzUHew\niRrBjlru4U3ziEMzn4V/uUho88WYXOhyVavP08Kqp1XVr/YnzcWL8abPO3mc/nOE\nemkJ4OQnNQ==\n-----END CERTIFICATE-----\n',
                                        hpkp_pin: 'Zp964pqQpx94buKz5C8LxtmtQQWq2ZcWnLzrmt187go=',
                                        issuer:
                                            'countryName=US, organizationName=DigiCert Inc, organizationalUnitName=www.digicert.com, commonName=DigiCert SHA2 High Assurance Server CA',
                                        notAfter: '2018-08-25 12:00:00',
                                        notBefore: '2018-02-26 00:00:00',
                                        publicKey: {
                                            algorithm: 'RSA',
                                            exponent: '65537',
                                            size: '2048',
                                        },
                                        serialNumber: '18124256745346573412053511668818424236',
                                        signatureAlgorithm: 'sha256',
                                        subject:
                                            'countryName=US, stateOrProvinceName=CA, localityName=Sunnyvale, organizationName=Yahoo Holdings, Inc., commonName=*.www.yahoo.com',
                                        subjectAlternativeName: {
                                            DNS: [
                                                '*.www.yahoo.com',
                                                'add.my.yahoo.com',
                                                '*.amp.yimg.com',
                                                'au.yahoo.com',
                                                'be.yahoo.com',
                                                'br.yahoo.com',
                                                'ca.my.yahoo.com',
                                                'ca.rogers.yahoo.com',
                                                'ca.yahoo.com',
                                                'ddl.fp.yahoo.com',
                                                'de.yahoo.com',
                                                'en-maktoob.yahoo.com',
                                                'espanol.yahoo.com',
                                                'es.yahoo.com',
                                                'fr-be.yahoo.com',
                                                'fr-ca.rogers.yahoo.com',
                                                'frontier.yahoo.com',
                                                'fr.yahoo.com',
                                                'gr.yahoo.com',
                                                'hk.yahoo.com',
                                                'hsrd.yahoo.com',
                                                'ideanetsetter.yahoo.com',
                                                'id.yahoo.com',
                                                'ie.yahoo.com',
                                                'in.yahoo.com',
                                                'it.yahoo.com',
                                                'maktoob.yahoo.com',
                                                'malaysia.yahoo.com',
                                                'mbp.yimg.com',
                                                'my.yahoo.com',
                                                'nz.yahoo.com',
                                                'ph.yahoo.com',
                                                'qc.yahoo.com',
                                                'ro.yahoo.com',
                                                'se.yahoo.com',
                                                'sg.yahoo.com',
                                                'tw.yahoo.com',
                                                'uk.yahoo.com',
                                                'us.yahoo.com',
                                                'verizon.yahoo.com',
                                                'vn.yahoo.com',
                                                'www.yahoo.com',
                                                'yahoo.com',
                                                'za.yahoo.com',
                                            ],
                                        },
                                    },
                                    {
                                        as_pem:
                                            '-----BEGIN CERTIFICATE-----\nMIIEsTCCA5mgAwIBAgIQBOHnpNxc8vNtwCtCuF0VnzANBgkqhkiG9w0BAQsFADBs\nMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\nd3cuZGlnaWNlcnQuY29tMSswKQYDVQQDEyJEaWdpQ2VydCBIaWdoIEFzc3VyYW5j\nZSBFViBSb290IENBMB4XDTEzMTAyMjEyMDAwMFoXDTI4MTAyMjEyMDAwMFowcDEL\nMAkGA1UEBhMCVVMxFTATBgNVBAoTDERpZ2lDZXJ0IEluYzEZMBcGA1UECxMQd3d3\nLmRpZ2ljZXJ0LmNvbTEvMC0GA1UEAxMmRGlnaUNlcnQgU0hBMiBIaWdoIEFzc3Vy\nYW5jZSBTZXJ2ZXIgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC2\n4C/CJAbIbQRf1+8KZAayfSImZRauQkCbztyfn3YHPsMwVYcZuU+UDlqUH1VWtMIC\nKq/QmO4LQNfE0DtyyBSe75CxEamu0si4QzrZCwvV1ZX1QK/IHe1NnF9Xt4ZQaJn1\nitrSxwUfqJfJ3KSxgoQtxq2lnMcZgqaFD15EWCo3j/018QsIJzJa9buLnqS9UdAn\n4t07QjOjBSjEuyjMmqwrIw14xnvmXnG3Sj4I+4G3FhahnSMSTeXXkgisdaScus0X\nsh5ENWV/UyU50RwKmmMbGZJ0aAo3wsJSSMs5WqK24V3B3aAguCGikyZvFEohQcft\nbZvySC/zA/WiaJJTL17jAgMBAAGjggFJMIIBRTASBgNVHRMBAf8ECDAGAQH/AgEA\nMA4GA1UdDwEB/wQEAwIBhjAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIw\nNAYIKwYBBQUHAQEEKDAmMCQGCCsGAQUFBzABhhhodHRwOi8vb2NzcC5kaWdpY2Vy\ndC5jb20wSwYDVR0fBEQwQjBAoD6gPIY6aHR0cDovL2NybDQuZGlnaWNlcnQuY29t\nL0RpZ2lDZXJ0SGlnaEFzc3VyYW5jZUVWUm9vdENBLmNybDA9BgNVHSAENjA0MDIG\nBFUdIAAwKjAoBggrBgEFBQcCARYcaHR0cHM6Ly93d3cuZGlnaWNlcnQuY29tL0NQ\nUzAdBgNVHQ4EFgQUUWj/kK8CB3U8zNllZGKiErhZcjswHwYDVR0jBBgwFoAUsT7D\naQP4v0cB1JgmGggC72NkK8MwDQYJKoZIhvcNAQELBQADggEBABiKlYkD5m3fXPwd\naOpKj4PWUS+Na0QWnqxj9dJubISZi6qBcYRb7TROsLd5kinMLYBq8I4g4Xmk/gNH\nE+r1hspZcX30BJZr01lYPf7TMSVcGDiEo+afgv2MW5gxTs14nhr9hctJqvIni5ly\n/D6q1UEL2tU2ob8cbkdJf17ZSHwD2f2LSaCYJkJA69aSEaRkCldUxPUd1gJea6zu\nxICaEnL6VpPX/78whQYwvwt/Tv9XBZ0k7YXDK/umdaisLRbvfXknsuvCnQsH6qqF\n0wGjIChBWUMo0oHjqvbsezt3tkBigAVBRQHvFwY+3sAzm2fTYS5yh+Rp/BIAV0Ae\ncPUeybQ=\n-----END CERTIFICATE-----\n',
                                        hpkp_pin: 'k2v657xBsOVe1PQRwOsHsw3bsGT2VzIqz5K+59sNQws=',
                                        issuer:
                                            'countryName=US, organizationName=DigiCert Inc, organizationalUnitName=www.digicert.com, commonName=DigiCert High Assurance EV Root CA',
                                        notAfter: '2028-10-22 12:00:00',
                                        notBefore: '2013-10-22 12:00:00',
                                        publicKey: {
                                            algorithm: 'RSA',
                                            exponent: '65537',
                                            size: '2048',
                                        },
                                        serialNumber: '6489877074546166222510380951761917343',
                                        signatureAlgorithm: 'sha256',
                                        subject:
                                            'countryName=US, organizationName=DigiCert Inc, organizationalUnitName=www.digicert.com, commonName=DigiCert SHA2 High Assurance Server CA',
                                    },
                                ],
                                certificate_has_must_staple_extension: true,
                                certificate_included_scts_count: 2,
                                certificate_matches_hostname: true,
                                has_anchor_in_certificate_chain: false,
                                has_sha1_in_certificate_chain: true,
                                is_certificate_chain_order_valid: false,
                                is_leaf_certificate_ev: false,
                                is_ocsp_response_trusted: false,
                                ocsp_response: {
                                    producedAt: 'May 15 06:35:49 2018 GMT',
                                    responderID: '5168FF90AF0207753CCCD9656462A212B859723B',
                                    responseStatus: 'successful',
                                    responseType: 'Basic OCSP Response',
                                    responses: [
                                        {
                                            certID: {
                                                hashAlgorithm: 'sha1',
                                                issuerKeyHash:
                                                    '5168FF90AF0207753CCCD9656462A212B859723B',
                                                issuerNameHash:
                                                    'CF26F518FAC97E8F8CB342E01C2F6A109E8E5F0A',
                                                serialNumber: '0DA29AD9524C1F4FF3FB763BBE52B1AC',
                                            },
                                            certStatus: 'good',
                                            nextUpdate: 'May 22 05:50:49 2018 GMT',
                                            thisUpdate: 'May 15 06:35:49 2018 GMT',
                                        },
                                    ],
                                    version: '1',
                                },
                                ocsp_response_status: 'SUCCESSFUL',
                                path_validation_error_list: [],
                                path_validation_result_list: [
                                    {
                                        is_certificate_trusted: true,
                                        trust_store: {
                                            ev_oids: [],
                                            name: 'Android',
                                            path:
                                                '/usr/local/lib/python3.6/site-packages/sslyze/plugins/utils/trust_store/pem_files/google_aosp.pem',
                                            version: '8.1.0_r9',
                                        },
                                        verify_string: 'ok',
                                    },
                                    {
                                        is_certificate_trusted: true,
                                        trust_store: {
                                            ev_oids: [],
                                            name: 'iOS',
                                            path:
                                                '/usr/local/lib/python3.6/site-packages/sslyze/plugins/utils/trust_store/pem_files/apple_ios.pem',
                                            version: '11',
                                        },
                                        verify_string: 'ok',
                                    },
                                    {
                                        is_certificate_trusted: true,
                                        trust_store: {
                                            ev_oids: [],
                                            name: 'macOS',
                                            path:
                                                '/usr/local/lib/python3.6/site-packages/sslyze/plugins/utils/trust_store/pem_files/apple_macos.pem',
                                            version: 'High Sierra',
                                        },
                                        verify_string: 'ok',
                                    },
                                    {
                                        is_certificate_trusted: true,
                                        trust_store: {
                                            ev_oids: [
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                                {},
                                            ],
                                            name: 'Mozilla',
                                            path:
                                                '/usr/local/lib/python3.6/site-packages/sslyze/plugins/utils/trust_store/pem_files/mozilla_nss.pem',
                                            version: '2018-04-12',
                                        },
                                        verify_string: 'ok',
                                    },
                                    {
                                        is_certificate_trusted: true,
                                        trust_store: {
                                            ev_oids: [],
                                            name: 'ORACLE_JAVA',
                                            path:
                                                '/usr/local/lib/python3.6/site-packages/sslyze/plugins/utils/trust_store/pem_files/oracle_java.pem',
                                            version: 'jre-10.0.1',
                                        },
                                        verify_string: 'ok',
                                    },
                                    {
                                        is_certificate_trusted: true,
                                        trust_store: {
                                            ev_oids: [],
                                            name: 'Windows',
                                            path:
                                                '/usr/local/lib/python3.6/site-packages/sslyze/plugins/utils/trust_store/pem_files/microsoft_windows.pem',
                                            version: '2018-04-26',
                                        },
                                        verify_string: 'ok',
                                    },
                                ],
                                successful_trust_store: {
                                    ev_oids: [],
                                    name: 'Windows',
                                    path:
                                        '/usr/local/lib/python3.6/site-packages/sslyze/plugins/utils/trust_store/pem_files/microsoft_windows.pem',
                                    version: '2018-04-26',
                                },
                                symantec_distrust_timeline: null,
                                verified_certificate_chain: [
                                    {
                                        as_pem:
                                            '-----BEGIN CERTIFICATE-----\nMIIJAzCCB+ugAwIBAgIQDaKa2VJMH0/z+3Y7vlKxrDANBgkqhkiG9w0BAQsFADBw\nMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\nd3cuZGlnaWNlcnQuY29tMS8wLQYDVQQDEyZEaWdpQ2VydCBTSEEyIEhpZ2ggQXNz\ndXJhbmNlIFNlcnZlciBDQTAeFw0xODAyMjYwMDAwMDBaFw0xODA4MjUxMjAwMDBa\nMGcxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTESMBAGA1UEBxMJU3Vubnl2YWxl\nMR0wGwYDVQQKExRZYWhvbyBIb2xkaW5ncywgSW5jLjEYMBYGA1UEAwwPKi53d3cu\neWFob28uY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6mmaB9+8\nbvzKgn4LNFEc7k3E2EdSlWQgkvRYwXo8NhWGbYRtULk6HKbHV/dqTki/4GAtOrWZ\n3qaias7KtG4vtOdAVIIYk64rJRBsbylrpDFmyxP9AdHAyuFYqDYil48ZHR/+n7WT\nIF4TjCaALHCZe8YWE/9U+wnjTclbl+pnprjLsHnxJqInvHR2Eot1ldP0e52isPN3\nw6jfdZ+Yp5eZJoyLNDI98bXSQq18GufSz3DT48YZRBVR6jXxa17s14vXzZyOpZdz\n+5T6EwUrGwHRhLObDU2yT2aRmhPNcts6HcqxRwdoioHWoO8yhlrGQ223Bphd6Hz+\neLGOBygLS/gwXQIDAQABo4IFoDCCBZwwHwYDVR0jBBgwFoAUUWj/kK8CB3U8zNll\nZGKiErhZcjswHQYDVR0OBBYEFBzt54eMUWBuNbLttk+YahZ/eNI0MIICxwYDVR0R\nBIICvjCCArqCDyoud3d3LnlhaG9vLmNvbYIQYWRkLm15LnlhaG9vLmNvbYIOKi5h\nbXAueWltZy5jb22CDGF1LnlhaG9vLmNvbYIMYmUueWFob28uY29tggxici55YWhv\nby5jb22CD2NhLm15LnlhaG9vLmNvbYITY2Eucm9nZXJzLnlhaG9vLmNvbYIMY2Eu\neWFob28uY29tghBkZGwuZnAueWFob28uY29tggxkZS55YWhvby5jb22CFGVuLW1h\na3Rvb2IueWFob28uY29tghFlc3Bhbm9sLnlhaG9vLmNvbYIMZXMueWFob28uY29t\ngg9mci1iZS55YWhvby5jb22CFmZyLWNhLnJvZ2Vycy55YWhvby5jb22CEmZyb250\naWVyLnlhaG9vLmNvbYIMZnIueWFob28uY29tggxnci55YWhvby5jb22CDGhrLnlh\naG9vLmNvbYIOaHNyZC55YWhvby5jb22CF2lkZWFuZXRzZXR0ZXIueWFob28uY29t\nggxpZC55YWhvby5jb22CDGllLnlhaG9vLmNvbYIMaW4ueWFob28uY29tggxpdC55\nYWhvby5jb22CEW1ha3Rvb2IueWFob28uY29tghJtYWxheXNpYS55YWhvby5jb22C\nDG1icC55aW1nLmNvbYIMbXkueWFob28uY29tggxuei55YWhvby5jb22CDHBoLnlh\naG9vLmNvbYIMcWMueWFob28uY29tggxyby55YWhvby5jb22CDHNlLnlhaG9vLmNv\nbYIMc2cueWFob28uY29tggx0dy55YWhvby5jb22CDHVrLnlhaG9vLmNvbYIMdXMu\neWFob28uY29tghF2ZXJpem9uLnlhaG9vLmNvbYIMdm4ueWFob28uY29tgg13d3cu\neWFob28uY29tggl5YWhvby5jb22CDHphLnlhaG9vLmNvbTAOBgNVHQ8BAf8EBAMC\nBaAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMHUGA1UdHwRuMGwwNKAy\noDCGLmh0dHA6Ly9jcmwzLmRpZ2ljZXJ0LmNvbS9zaGEyLWhhLXNlcnZlci1nNi5j\ncmwwNKAyoDCGLmh0dHA6Ly9jcmw0LmRpZ2ljZXJ0LmNvbS9zaGEyLWhhLXNlcnZl\nci1nNi5jcmwwTAYDVR0gBEUwQzA3BglghkgBhv1sAQEwKjAoBggrBgEFBQcCARYc\naHR0cHM6Ly93d3cuZGlnaWNlcnQuY29tL0NQUzAIBgZngQwBAgIwgYMGCCsGAQUF\nBwEBBHcwdTAkBggrBgEFBQcwAYYYaHR0cDovL29jc3AuZGlnaWNlcnQuY29tME0G\nCCsGAQUFBzAChkFodHRwOi8vY2FjZXJ0cy5kaWdpY2VydC5jb20vRGlnaUNlcnRT\nSEEySGlnaEFzc3VyYW5jZVNlcnZlckNBLmNydDAMBgNVHRMBAf8EAjAAMIIBBQYK\nKwYBBAHWeQIEAgSB9gSB8wDxAHYAu9nfvB+KcbWTlCOXqpJ7RzhXlQqrUugakJZk\nNo4e0YUAAAFh02HjzAAABAMARzBFAiEA3sr1uZcc9b+IzY6z66Rz1yHX1ZuVYpnQ\nyTx6WEdb2pgCIGhfjRPibuJ9J3nar8U4qS3FeoXI6sElxrQfi3ct8w3OAHcAh3W/\n51l8+IxDmV+9827/Vo1HVjb/SrVgwbTq/16ggw8AAAFh02HjvgAABAMASDBGAiEA\n756cn+DnfAhzgbonXNiHvJtU+SCTho8u23bM14Nh0+MCIQC90B9AckWD5+1o91i9\nONLt8lkdtFYufg/+VH1IgOaZsTANBgkqhkiG9w0BAQsFAAOCAQEATdztspRySWON\nMwcDmLUjKdVq3LIwCQxbQfLzUQHBqmrP9kqSnPDVZn/ALDnjdRGQ4tzGkQlRfGYl\npry0ZfcDwswq6FOR2gqHI/Q+k3FB6PigUlbSVEuARg+VKYFu+B9arQrg4acqUmtf\nfIAh5iVGmWfphg2nPKjpubOfeI/XiknvJG2aEfoLIfR+CHrJ3sN4U2KYdBMhusJg\nkY7rprI1r5dNR1IdRgxO4dY+QU4cUsyeGNhRkt4TEeEsDV8UNWQ3ge1qdrwzUHew\niRrBjlru4U3ziEMzn4V/uUho88WYXOhyVavP08Kqp1XVr/YnzcWL8abPO3mc/nOE\nemkJ4OQnNQ==\n-----END CERTIFICATE-----\n',
                                        hpkp_pin: 'Zp964pqQpx94buKz5C8LxtmtQQWq2ZcWnLzrmt187go=',
                                        issuer:
                                            'countryName=US, organizationName=DigiCert Inc, organizationalUnitName=www.digicert.com, commonName=DigiCert SHA2 High Assurance Server CA',
                                        notAfter: '2018-08-25 12:00:00',
                                        notBefore: '2018-02-26 00:00:00',
                                        publicKey: {
                                            algorithm: 'RSA',
                                            exponent: '65537',
                                            size: '2048',
                                        },
                                        serialNumber: '18124256745346573412053511668818424236',
                                        signatureAlgorithm: 'sha256',
                                        subject:
                                            'countryName=US, stateOrProvinceName=CA, localityName=Sunnyvale, organizationName=Yahoo Holdings, Inc., commonName=*.www.yahoo.com',
                                        subjectAlternativeName: {
                                            DNS: [
                                                '*.www.yahoo.com',
                                                'add.my.yahoo.com',
                                                '*.amp.yimg.com',
                                                'au.yahoo.com',
                                                'be.yahoo.com',
                                                'br.yahoo.com',
                                                'ca.my.yahoo.com',
                                                'ca.rogers.yahoo.com',
                                                'ca.yahoo.com',
                                                'ddl.fp.yahoo.com',
                                                'de.yahoo.com',
                                                'en-maktoob.yahoo.com',
                                                'espanol.yahoo.com',
                                                'es.yahoo.com',
                                                'fr-be.yahoo.com',
                                                'fr-ca.rogers.yahoo.com',
                                                'frontier.yahoo.com',
                                                'fr.yahoo.com',
                                                'gr.yahoo.com',
                                                'hk.yahoo.com',
                                                'hsrd.yahoo.com',
                                                'ideanetsetter.yahoo.com',
                                                'id.yahoo.com',
                                                'ie.yahoo.com',
                                                'in.yahoo.com',
                                                'it.yahoo.com',
                                                'maktoob.yahoo.com',
                                                'malaysia.yahoo.com',
                                                'mbp.yimg.com',
                                                'my.yahoo.com',
                                                'nz.yahoo.com',
                                                'ph.yahoo.com',
                                                'qc.yahoo.com',
                                                'ro.yahoo.com',
                                                'se.yahoo.com',
                                                'sg.yahoo.com',
                                                'tw.yahoo.com',
                                                'uk.yahoo.com',
                                                'us.yahoo.com',
                                                'verizon.yahoo.com',
                                                'vn.yahoo.com',
                                                'www.yahoo.com',
                                                'yahoo.com',
                                                'za.yahoo.com',
                                            ],
                                        },
                                    },
                                    {
                                        as_pem:
                                            '-----BEGIN CERTIFICATE-----\nMIIEsTCCA5mgAwIBAgIQBOHnpNxc8vNtwCtCuF0VnzANBgkqhkiG9w0BAQsFADBs\nMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\nd3cuZGlnaWNlcnQuY29tMSswKQYDVQQDEyJEaWdpQ2VydCBIaWdoIEFzc3VyYW5j\nZSBFViBSb290IENBMB4XDTEzMTAyMjEyMDAwMFoXDTI4MTAyMjEyMDAwMFowcDEL\nMAkGA1UEBhMCVVMxFTATBgNVBAoTDERpZ2lDZXJ0IEluYzEZMBcGA1UECxMQd3d3\nLmRpZ2ljZXJ0LmNvbTEvMC0GA1UEAxMmRGlnaUNlcnQgU0hBMiBIaWdoIEFzc3Vy\nYW5jZSBTZXJ2ZXIgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC2\n4C/CJAbIbQRf1+8KZAayfSImZRauQkCbztyfn3YHPsMwVYcZuU+UDlqUH1VWtMIC\nKq/QmO4LQNfE0DtyyBSe75CxEamu0si4QzrZCwvV1ZX1QK/IHe1NnF9Xt4ZQaJn1\nitrSxwUfqJfJ3KSxgoQtxq2lnMcZgqaFD15EWCo3j/018QsIJzJa9buLnqS9UdAn\n4t07QjOjBSjEuyjMmqwrIw14xnvmXnG3Sj4I+4G3FhahnSMSTeXXkgisdaScus0X\nsh5ENWV/UyU50RwKmmMbGZJ0aAo3wsJSSMs5WqK24V3B3aAguCGikyZvFEohQcft\nbZvySC/zA/WiaJJTL17jAgMBAAGjggFJMIIBRTASBgNVHRMBAf8ECDAGAQH/AgEA\nMA4GA1UdDwEB/wQEAwIBhjAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIw\nNAYIKwYBBQUHAQEEKDAmMCQGCCsGAQUFBzABhhhodHRwOi8vb2NzcC5kaWdpY2Vy\ndC5jb20wSwYDVR0fBEQwQjBAoD6gPIY6aHR0cDovL2NybDQuZGlnaWNlcnQuY29t\nL0RpZ2lDZXJ0SGlnaEFzc3VyYW5jZUVWUm9vdENBLmNybDA9BgNVHSAENjA0MDIG\nBFUdIAAwKjAoBggrBgEFBQcCARYcaHR0cHM6Ly93d3cuZGlnaWNlcnQuY29tL0NQ\nUzAdBgNVHQ4EFgQUUWj/kK8CB3U8zNllZGKiErhZcjswHwYDVR0jBBgwFoAUsT7D\naQP4v0cB1JgmGggC72NkK8MwDQYJKoZIhvcNAQELBQADggEBABiKlYkD5m3fXPwd\naOpKj4PWUS+Na0QWnqxj9dJubISZi6qBcYRb7TROsLd5kinMLYBq8I4g4Xmk/gNH\nE+r1hspZcX30BJZr01lYPf7TMSVcGDiEo+afgv2MW5gxTs14nhr9hctJqvIni5ly\n/D6q1UEL2tU2ob8cbkdJf17ZSHwD2f2LSaCYJkJA69aSEaRkCldUxPUd1gJea6zu\nxICaEnL6VpPX/78whQYwvwt/Tv9XBZ0k7YXDK/umdaisLRbvfXknsuvCnQsH6qqF\n0wGjIChBWUMo0oHjqvbsezt3tkBigAVBRQHvFwY+3sAzm2fTYS5yh+Rp/BIAV0Ae\ncPUeybQ=\n-----END CERTIFICATE-----\n',
                                        hpkp_pin: 'k2v657xBsOVe1PQRwOsHsw3bsGT2VzIqz5K+59sNQws=',
                                        issuer:
                                            'countryName=US, organizationName=DigiCert Inc, organizationalUnitName=www.digicert.com, commonName=DigiCert High Assurance EV Root CA',
                                        notAfter: '2028-10-22 12:00:00',
                                        notBefore: '2013-10-22 12:00:00',
                                        publicKey: {
                                            algorithm: 'RSA',
                                            exponent: '65537',
                                            size: '2048',
                                        },
                                        serialNumber: '6489877074546166222510380951761917343',
                                        signatureAlgorithm: 'sha256',
                                        subject:
                                            'countryName=US, organizationName=DigiCert Inc, organizationalUnitName=www.digicert.com, commonName=DigiCert SHA2 High Assurance Server CA',
                                    },
                                    {
                                        as_pem:
                                            '-----BEGIN CERTIFICATE-----\nMIIDxTCCAq2gAwIBAgIQAqxcJmoLQJuPC3nyrkYldzANBgkqhkiG9w0BAQUFADBs\nMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\nd3cuZGlnaWNlcnQuY29tMSswKQYDVQQDEyJEaWdpQ2VydCBIaWdoIEFzc3VyYW5j\nZSBFViBSb290IENBMB4XDTA2MTExMDAwMDAwMFoXDTMxMTExMDAwMDAwMFowbDEL\nMAkGA1UEBhMCVVMxFTATBgNVBAoTDERpZ2lDZXJ0IEluYzEZMBcGA1UECxMQd3d3\nLmRpZ2ljZXJ0LmNvbTErMCkGA1UEAxMiRGlnaUNlcnQgSGlnaCBBc3N1cmFuY2Ug\nRVYgUm9vdCBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMbM5XPm\n+9S75S0tMqbf5YE/yc0lSbZxKsPVlDRnogocsF9ppkCxxLeyj9CYpKlBWTrT3JTW\nPNt0OKRKzE0lgvdKpVMSOO7zSW1xkX5jtqumX8OkhPhPYlG++MXs2ziS4wblCJEM\nxChBVfvLWokVfnHoNb9Ncgk9vjo4UFt3MRuNs8ckRZqnrG0AFFoEt7oT61EKmEFB\nIk5lYYeBQVCmeVyJ3hlKV9Uu5l0cUyx+mM0aBhakaHPQNAQTXKFx01p8VdteZOE3\nhzBWBOURtCmAEvF5OYiiAhF8J2a3iLd48soKqDirCmTCv2ZdlYTBoSUeh10aUAsg\nEsxBu24LUTi4S8sCAwEAAaNjMGEwDgYDVR0PAQH/BAQDAgGGMA8GA1UdEwEB/wQF\nMAMBAf8wHQYDVR0OBBYEFLE+w2kD+L9HAdSYJhoIAu9jZCvDMB8GA1UdIwQYMBaA\nFLE+w2kD+L9HAdSYJhoIAu9jZCvDMA0GCSqGSIb3DQEBBQUAA4IBAQAcGgaX3Nec\nnzyIZgYIVyHbIUf4KmeqvxgydkAQV8GK83rZEWWONfqe/EW1ntlMMUu4kehDLI6z\neM7b41N5cdblIZQB2lWHmiRk9opmzN6cN82oNLFpmyPInngiK3BD41VHMWEZ71jF\nhS9OMPagMRYjyOfiZRYzy78aG6A9+MpeizGLYAiJLQwGXFK3xPkKmNEVX58Svnw2\nYzi9RKR/5CYrCsSXaQ3pjOLAEFe4yHYSkVXySGnYvCoCWw9E1CAx2/S6cCZdkGCe\nvEsXCS+0yx5DaMkHJ8HSXPfqIbloEpw8nL+e/IBcm2PN7EeqJSdnoDfzAIJ9VNep\n+OkuE6N36B9K\n-----END CERTIFICATE-----\n',
                                        hpkp_pin: 'WoiWRyIOVNa9ihaBciRSC7XHjliYS9VwUGOIud4PB18=',
                                        issuer:
                                            'countryName=US, organizationName=DigiCert Inc, organizationalUnitName=www.digicert.com, commonName=DigiCert High Assurance EV Root CA',
                                        notAfter: '2031-11-10 00:00:00',
                                        notBefore: '2006-11-10 00:00:00',
                                        publicKey: {
                                            algorithm: 'RSA',
                                            exponent: '65537',
                                            size: '2048',
                                        },
                                        serialNumber: '3553400076410547919724730734378100087',
                                        signatureAlgorithm: 'sha1',
                                        subject:
                                            'countryName=US, organizationName=DigiCert Inc, organizationalUnitName=www.digicert.com, commonName=DigiCert High Assurance EV Root CA',
                                    },
                                ],
                            },
                            compression: {
                                compression_name: null,
                            },
                            fallback: {
                                supports_fallback_scsv: true,
                            },
                            heartbleed: {
                                is_vulnerable_to_heartbleed: false,
                            },
                            openssl_ccs: {
                                is_vulnerable_to_ccs_injection: false,
                            },
                            reneg: {
                                error_message:
                                    'ConnectionResetError - [Errno 104] Connection reset by peer',
                            },
                            resum: {
                                _rate_result: {
                                    attempted_resumptions_nb: 5,
                                    errored_resumptions_list: [],
                                    failed_resumptions_nb: 5,
                                    scan_command: {},
                                    server_info: {
                                        client_auth_credentials: null,
                                        client_auth_requirement: 'DISABLED',
                                        highest_ssl_version_supported: 'TLSV1_2',
                                        hostname: 'www.yahoo.com',
                                        http_tunneling_settings: null,
                                        ip_address: '87.248.98.8',
                                        openssl_cipher_string_supported:
                                            'ECDHE-RSA-AES128-GCM-SHA256',
                                        port: 443,
                                        tls_server_name_indication: 'www.yahoo.com',
                                        tls_wrapped_protocol: 'HTTPS',
                                        xmpp_to_hostname: null,
                                    },
                                    successful_resumptions_nb: 0,
                                },
                                attempted_resumptions_nb: 5,
                                errored_resumptions_list: [],
                                failed_resumptions_nb: 5,
                                is_ticket_resumption_supported: true,
                                successful_resumptions_nb: 0,
                                ticket_resumption_error: null,
                                ticket_resumption_failed_reason: null,
                            },
                            robot: {
                                robot_result_enum: 'VULNERABLE_STRONG_ORACLE',
                            },
                            sslv2: {
                                accepted_cipher_list: [],
                                errored_cipher_list: [],
                                preferred_cipher: null,
                                rejected_cipher_list: [
                                    {
                                        handshake_error_message: 'TLS / Unexpected EOF',
                                        is_anonymous: false,
                                        openssl_name: 'RC4-MD5',
                                        ssl_version: 'SSLV2',
                                    },
                                ],
                            },
                            sslv3: {
                                accepted_cipher_list: [],
                                errored_cipher_list: [],
                                preferred_cipher: null,
                                rejected_cipher_list: [],
                            },
                            tlsv1: {
                                accepted_cipher_list: [
                                    {
                                        dh_info: {
                                            A:
                                                '0x00ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
                                            B:
                                                '0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
                                            Cofactor: '1',
                                            Field_Type: 'prime-field',
                                            Generator:
                                                '0x046b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c2964fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
                                            GeneratorType: 'uncompressed',
                                            GroupSize: '256',
                                            Order:
                                                '0x00ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551',
                                            Prime:
                                                '0x00ffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
                                            Seed: '0xc49d360886e704936a6678e1139d26b7819f7e90',
                                            Type: 'ECDH',
                                        },
                                        is_anonymous: false,
                                        key_size: 256,
                                        openssl_name: 'ECDHE-RSA-AES256-SHA',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1',
                                    },
                                    {
                                        dh_info: null,
                                        is_anonymous: false,
                                        key_size: 256,
                                        openssl_name: 'AES256-SHA',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1',
                                    },
                                    {
                                        dh_info: {
                                            A:
                                                '0x00ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
                                            B:
                                                '0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
                                            Cofactor: '1',
                                            Field_Type: 'prime-field',
                                            Generator:
                                                '0x046b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c2964fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
                                            GeneratorType: 'uncompressed',
                                            GroupSize: '256',
                                            Order:
                                                '0x00ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551',
                                            Prime:
                                                '0x00ffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
                                            Seed: '0xc49d360886e704936a6678e1139d26b7819f7e90',
                                            Type: 'ECDH',
                                        },
                                        is_anonymous: false,
                                        key_size: 128,
                                        openssl_name: 'ECDHE-RSA-AES128-SHA',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1',
                                    },
                                    {
                                        dh_info: null,
                                        is_anonymous: false,
                                        key_size: 128,
                                        openssl_name: 'AES128-SHA',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1',
                                    },
                                ],
                                errored_cipher_list: [],
                                preferred_cipher: {
                                    dh_info: {
                                        A:
                                            '0x00ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
                                        B:
                                            '0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
                                        Cofactor: '1',
                                        Field_Type: 'prime-field',
                                        Generator:
                                            '0x046b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c2964fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
                                        GeneratorType: 'uncompressed',
                                        GroupSize: '256',
                                        Order:
                                            '0x00ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551',
                                        Prime:
                                            '0x00ffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
                                        Seed: '0xc49d360886e704936a6678e1139d26b7819f7e90',
                                        Type: 'ECDH',
                                    },
                                    is_anonymous: false,
                                    key_size: 128,
                                    openssl_name: 'ECDHE-RSA-AES128-SHA',
                                    post_handshake_response:
                                        'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                    ssl_version: 'TLSV1',
                                },
                                rejected_cipher_list: [
                                    {
                                        handshake_error_message: 'TLS / Alert: handshake failure',
                                        is_anonymous: false,
                                        openssl_name: 'SEED-SHA',
                                        ssl_version: 'TLSV1',
                                    },
                                    {
                                        handshake_error_message: 'TLS / Alert: handshake failure',
                                        is_anonymous: false,
                                        openssl_name: 'RC4-SHA',
                                        ssl_version: 'TLSV1',
                                    },
                                    {
                                        handshake_error_message: 'TLS / Alert: handshake failure',
                                        is_anonymous: false,
                                        openssl_name: 'RC4-MD5',
                                        ssl_version: 'TLSV1',
                                    },
                                ],
                            },
                            tlsv1_1: {
                                accepted_cipher_list: [
                                    {
                                        dh_info: {
                                            A:
                                                '0x00ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
                                            B:
                                                '0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
                                            Cofactor: '1',
                                            Field_Type: 'prime-field',
                                            Generator:
                                                '0x046b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c2964fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
                                            GeneratorType: 'uncompressed',
                                            GroupSize: '256',
                                            Order:
                                                '0x00ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551',
                                            Prime:
                                                '0x00ffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
                                            Seed: '0xc49d360886e704936a6678e1139d26b7819f7e90',
                                            Type: 'ECDH',
                                        },
                                        is_anonymous: false,
                                        key_size: 256,
                                        openssl_name: 'ECDHE-RSA-AES256-SHA',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_1',
                                    },
                                    {
                                        dh_info: null,
                                        is_anonymous: false,
                                        key_size: 256,
                                        openssl_name: 'AES256-SHA',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_1',
                                    },
                                    {
                                        dh_info: {
                                            A:
                                                '0x00ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
                                            B:
                                                '0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
                                            Cofactor: '1',
                                            Field_Type: 'prime-field',
                                            Generator:
                                                '0x046b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c2964fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
                                            GeneratorType: 'uncompressed',
                                            GroupSize: '256',
                                            Order:
                                                '0x00ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551',
                                            Prime:
                                                '0x00ffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
                                            Seed: '0xc49d360886e704936a6678e1139d26b7819f7e90',
                                            Type: 'ECDH',
                                        },
                                        is_anonymous: false,
                                        key_size: 128,
                                        openssl_name: 'ECDHE-RSA-AES128-SHA',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_1',
                                    },
                                    {
                                        dh_info: null,
                                        is_anonymous: false,
                                        key_size: 128,
                                        openssl_name: 'AES128-SHA',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_1',
                                    },
                                ],
                                errored_cipher_list: [],
                                preferred_cipher: {
                                    dh_info: {
                                        A:
                                            '0x00ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
                                        B:
                                            '0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
                                        Cofactor: '1',
                                        Field_Type: 'prime-field',
                                        Generator:
                                            '0x046b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c2964fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
                                        GeneratorType: 'uncompressed',
                                        GroupSize: '256',
                                        Order:
                                            '0x00ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551',
                                        Prime:
                                            '0x00ffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
                                        Seed: '0xc49d360886e704936a6678e1139d26b7819f7e90',
                                        Type: 'ECDH',
                                    },
                                    is_anonymous: false,
                                    key_size: 128,
                                    openssl_name: 'ECDHE-RSA-AES128-SHA',
                                    post_handshake_response:
                                        'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                    ssl_version: 'TLSV1_1',
                                },
                                rejected_cipher_list: [
                                    {
                                        handshake_error_message: 'TLS / Alert: handshake failure',
                                        is_anonymous: false,
                                        openssl_name: 'SEED-SHA',
                                        ssl_version: 'TLSV1_1',
                                    },
                                ],
                            },
                            tlsv1_2: {
                                accepted_cipher_list: [
                                    {
                                        dh_info: null,
                                        is_anonymous: false,
                                        key_size: 256,
                                        openssl_name: 'AES256-SHA',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_2',
                                    },
                                    {
                                        dh_info: null,
                                        is_anonymous: false,
                                        key_size: 256,
                                        openssl_name: 'AES256-SHA256',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_2',
                                    },
                                    {
                                        dh_info: {
                                            A:
                                                '0x00ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
                                            B:
                                                '0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
                                            Cofactor: '1',
                                            Field_Type: 'prime-field',
                                            Generator:
                                                '0x046b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c2964fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
                                            GeneratorType: 'uncompressed',
                                            GroupSize: '256',
                                            Order:
                                                '0x00ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551',
                                            Prime:
                                                '0x00ffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
                                            Seed: '0xc49d360886e704936a6678e1139d26b7819f7e90',
                                            Type: 'ECDH',
                                        },
                                        is_anonymous: false,
                                        key_size: 256,
                                        openssl_name: 'ECDHE-RSA-AES256-SHA',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_2',
                                    },
                                    {
                                        dh_info: null,
                                        is_anonymous: false,
                                        key_size: 256,
                                        openssl_name: 'AES256-GCM-SHA384',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_2',
                                    },
                                    {
                                        dh_info: {
                                            A:
                                                '0x00ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
                                            B:
                                                '0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
                                            Cofactor: '1',
                                            Field_Type: 'prime-field',
                                            Generator:
                                                '0x046b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c2964fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
                                            GeneratorType: 'uncompressed',
                                            GroupSize: '256',
                                            Order:
                                                '0x00ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551',
                                            Prime:
                                                '0x00ffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
                                            Seed: '0xc49d360886e704936a6678e1139d26b7819f7e90',
                                            Type: 'ECDH',
                                        },
                                        is_anonymous: false,
                                        key_size: 256,
                                        openssl_name: 'ECDHE-RSA-AES256-SHA384',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_2',
                                    },
                                    {
                                        dh_info: {
                                            A:
                                                '0x00ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
                                            B:
                                                '0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
                                            Cofactor: '1',
                                            Field_Type: 'prime-field',
                                            Generator:
                                                '0x046b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c2964fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
                                            GeneratorType: 'uncompressed',
                                            GroupSize: '256',
                                            Order:
                                                '0x00ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551',
                                            Prime:
                                                '0x00ffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
                                            Seed: '0xc49d360886e704936a6678e1139d26b7819f7e90',
                                            Type: 'ECDH',
                                        },
                                        is_anonymous: false,
                                        key_size: 256,
                                        openssl_name: 'ECDHE-RSA-AES256-GCM-SHA384',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_2',
                                    },
                                    {
                                        dh_info: {
                                            A:
                                                '0x00ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
                                            B:
                                                '0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
                                            Cofactor: '1',
                                            Field_Type: 'prime-field',
                                            Generator:
                                                '0x046b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c2964fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
                                            GeneratorType: 'uncompressed',
                                            GroupSize: '256',
                                            Order:
                                                '0x00ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551',
                                            Prime:
                                                '0x00ffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
                                            Seed: '0xc49d360886e704936a6678e1139d26b7819f7e90',
                                            Type: 'ECDH',
                                        },
                                        is_anonymous: false,
                                        key_size: 128,
                                        openssl_name: 'ECDHE-RSA-AES128-SHA256',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_2',
                                    },
                                    {
                                        dh_info: null,
                                        is_anonymous: false,
                                        key_size: 128,
                                        openssl_name: 'AES128-SHA256',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_2',
                                    },
                                    {
                                        dh_info: null,
                                        is_anonymous: false,
                                        key_size: 128,
                                        openssl_name: 'AES128-GCM-SHA256',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_2',
                                    },
                                    {
                                        dh_info: {
                                            A:
                                                '0x00ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
                                            B:
                                                '0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
                                            Cofactor: '1',
                                            Field_Type: 'prime-field',
                                            Generator:
                                                '0x046b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c2964fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
                                            GeneratorType: 'uncompressed',
                                            GroupSize: '256',
                                            Order:
                                                '0x00ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551',
                                            Prime:
                                                '0x00ffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
                                            Seed: '0xc49d360886e704936a6678e1139d26b7819f7e90',
                                            Type: 'ECDH',
                                        },
                                        is_anonymous: false,
                                        key_size: 128,
                                        openssl_name: 'ECDHE-RSA-AES128-GCM-SHA256',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_2',
                                    },
                                    {
                                        dh_info: null,
                                        is_anonymous: false,
                                        key_size: 128,
                                        openssl_name: 'AES128-SHA',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_2',
                                    },
                                    {
                                        dh_info: {
                                            A:
                                                '0x00ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
                                            B:
                                                '0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
                                            Cofactor: '1',
                                            Field_Type: 'prime-field',
                                            Generator:
                                                '0x046b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c2964fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
                                            GeneratorType: 'uncompressed',
                                            GroupSize: '256',
                                            Order:
                                                '0x00ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551',
                                            Prime:
                                                '0x00ffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
                                            Seed: '0xc49d360886e704936a6678e1139d26b7819f7e90',
                                            Type: 'ECDH',
                                        },
                                        is_anonymous: false,
                                        key_size: 128,
                                        openssl_name: 'ECDHE-RSA-AES128-SHA',
                                        post_handshake_response:
                                            'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                        ssl_version: 'TLSV1_2',
                                    },
                                ],
                                errored_cipher_list: [],
                                preferred_cipher: {
                                    dh_info: {
                                        A:
                                            '0x00ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
                                        B:
                                            '0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
                                        Cofactor: '1',
                                        Field_Type: 'prime-field',
                                        Generator:
                                            '0x046b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c2964fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
                                        GeneratorType: 'uncompressed',
                                        GroupSize: '256',
                                        Order:
                                            '0x00ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551',
                                        Prime:
                                            '0x00ffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
                                        Seed: '0xc49d360886e704936a6678e1139d26b7819f7e90',
                                        Type: 'ECDH',
                                    },
                                    is_anonymous: false,
                                    key_size: 128,
                                    openssl_name: 'ECDHE-RSA-AES128-GCM-SHA256',
                                    post_handshake_response:
                                        'HTTP 302 Found - https://de.yahoo.com/?p=us',
                                    ssl_version: 'TLSV1_2',
                                },
                                rejected_cipher_list: [
                                    {
                                        handshake_error_message: 'TLS / Alert: handshake failure',
                                        is_anonymous: false,
                                        openssl_name: 'SEED-SHA',
                                        ssl_version: 'TLSV1_2',
                                    },
                                    {
                                        handshake_error_message: 'TLS / Alert: handshake failure',
                                        is_anonymous: false,
                                        openssl_name: 'RC4-SHA',
                                        ssl_version: 'TLSV1_2',
                                    },
                                ],
                            },
                            tlsv1_3: {
                                accepted_cipher_list: [],
                                errored_cipher_list: [],
                                preferred_cipher: null,
                                rejected_cipher_list: [
                                    {
                                        handshake_error_message: 'TLS / Alert: handshake failure',
                                        is_anonymous: false,
                                        openssl_name: 'TLS13-CHACHA20-POLY1305-SHA256',
                                        ssl_version: 'TLSV1_3',
                                    },
                                ],
                            },
                        },
                        server_info: {
                            client_auth_credentials: null,
                            client_auth_requirement: 'DISABLED',
                            highest_ssl_version_supported: 'TLSV1_2',
                            hostname: 'www.yahoo.com',
                            http_tunneling_settings: null,
                            ip_address: '87.248.98.8',
                            openssl_cipher_string_supported: 'ECDHE-RSA-AES128-GCM-SHA256',
                            port: 443,
                            tls_server_name_indication: 'www.yahoo.com',
                            tls_wrapped_protocol: 'HTTPS',
                            xmpp_to_hostname: null,
                        },
                    },
                ],
                invalid_targets: [],
                sslyze_url: 'https://github.com/nabla-c0d3/sslyze',
                sslyze_version: '1.4.1',
                total_scan_time: '6.826319217681885',
            });
            //console.log(JSON.stringify(findings, null, 2));
            // CERTINFO_OCSP_RESPONSE_IS_NOT_TRUSTED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'OCSP response not trusted',
                description:
                    'The server sent an OCSP response which is not trusted using the Mozilla trust store.',
                category: 'Certificate info',
                osi_layer: 'PRESENTATION',
                severity: 'MEDIUM',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // ROBOT_VULNERABLE
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Vulnerable to ROBOT attack',
                description:
                    'The server is vulnerable to the "Return Of Bleichenbacher\'s Oracle Threat".',
                category: 'Robot',
                osi_layer: 'PRESENTATION',
                severity: 'HIGH',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
            // RESUM_TICKET_RESUMPTION_SUPPORTED
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Ticket resumption supported',
                description: 'The server supports session resumption through ticket encapsulation.',
                category: 'Resumption',
                osi_layer: 'PRESENTATION',
                severity: 'INFORMATIONAL',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
            });
        });

        it('should transform an ordinary scan result 3', function() {
            const findings = transform({
                accepted_targets: [
                    {
                        commands_results: {
                            certinfo: {
                                error_message: 'Test failure',
                            },
                            compression: {
                                compression_name: 'Test compression',
                            },
                            fallback: {
                                supports_fallback_scsv: true,
                            },
                            heartbleed: {
                                is_vulnerable_to_heartbleed: false,
                            },
                            openssl_ccs: {
                                is_vulnerable_to_ccs_injection: false,
                            },
                            reneg: {
                                error_message: 'Test failure',
                            },
                            resum: {
                                ticket_resumption_exception: 'Test failure',
                                ticket_resumption_error: 'Test failure',
                            },
                            robot: {
                                robot_result_enum: 'NOT_VULNERABLE_NO_ORACLE',
                            },
                        },
                        server_info: {
                            client_auth_credentials: null,
                            client_auth_requirement: 'DISABLED',
                            highest_ssl_version_supported: 'TLSV1_2',
                            hostname: 'www.yahoo.com',
                            http_tunneling_settings: null,
                            ip_address: '87.248.98.8',
                            openssl_cipher_string_supported: 'ECDHE-RSA-AES128-GCM-SHA256',
                            port: 443,
                            tls_server_name_indication: 'www.yahoo.com',
                            tls_wrapped_protocol: 'HTTPS',
                            xmpp_to_hostname: null,
                        },
                    },
                ],
                invalid_targets: [],
                sslyze_url: 'https://github.com/nabla-c0d3/sslyze',
                sslyze_version: '1.4.1',
                total_scan_time: '6.826319217681885',
            });
            //console.log(JSON.stringify(findings, null, 2));
            // CERTINFO_ERROR
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Certificate info error',
                description: 'Certificate info could not be retrieved due to error: Test failure',
                category: 'Certificate info',
                osi_layer: 'NOT_APPLICABLE',
                severity: 'HIGH',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    error: 'Test failure',
                },
            });
            // RESUM_ERROR
            expect(findings).toContainEqual({
                id: '49bf7fd3-8512-4d73-a28f-608e493cd726',
                name: 'Session resumption error',
                description:
                    'Session resumption information could not be retrieved due to error: Test failure',
                category: 'Resumption',
                osi_layer: 'NOT_APPLICABLE',
                severity: 'HIGH',
                reference: null,
                hint: null,
                location: 'https://www.yahoo.com:443',
                attributes: {
                    error: 'Test failure',
                },
            });
        });
    });

    describe('worker', () => {
        beforeEach(() => {
            sslscan.scanTarget.mockClear();
        });

        it('should work with a single target', async () => {
            const result = await worker([{ location: 'www.yahoo.com' }]);

            expect(sslscan.scanTarget).toBeCalledWith('www.yahoo.com', '');

            expect(result).toMatchSnapshot();
        });

        it('should take parameters', async () => {
            const result = await worker([
                { location: 'www.yahoo.com', attributes: { SSLYZE_PARAMETER: '' } },
            ]);

            expect(sslscan.scanTarget).toBeCalledWith('www.yahoo.com', '');

            expect(result).toMatchSnapshot();
        });

        it('should run multiple scans when multiple targets are configured', async () => {
            const result = await worker([
                { location: 'www.yahoo.com' },
                { location: 'www.yahoo.com', attributes: { SSLYZE_PARAMETER: '' } },
            ]);

            expect(sslscan.scanTarget).toHaveBeenCalledTimes(2);
            expect(sslscan.scanTarget).toBeCalledWith('www.yahoo.com', '');
            expect(sslscan.scanTarget).toBeCalledWith('www.yahoo.com', '');

            expect(result).toMatchSnapshot();
        });

        it('should throw an error if a scan fails', async () => {
            sslscan.scanTarget.mockReturnValueOnce(Promise.reject());

            expect(worker([{ location: 'localhost' }])).rejects.toThrowErrorMatchingSnapshot();

            expect(sslscan.scanTarget).toBeCalledWith('localhost', '');
        });
    });
});
