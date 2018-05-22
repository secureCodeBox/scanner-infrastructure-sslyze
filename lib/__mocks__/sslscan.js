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
module.exports = {
    scanTarget: jest.fn(() =>
        Promise.resolve({
            res: {
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
                                ocsp_response: null,
                                ocsp_response_status: null,
                                path_validation_error_list: [
                                    {
                                        error_message: 'Test failure',
                                    },
                                ],
                                path_validation_result_list: [],
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
            },
            raw: 'some JSON',
        })
    ),
};
