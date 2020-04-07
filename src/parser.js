function parse(fileContent) {
    const serverScanResult = fileContent.server_scan_results[0];

    const partialFindings = [
        generateInformationalServiceFinding(serverScanResult),
        ...generateVulnarableTLSVersionFindings(serverScanResult),
    ];

    const serverInfo = serverScanResult.server_info;
    const { ip_address, hostname, port } = serverInfo.server_location;
    const location = `${hostname || ip_address}:${port}`;

    // Enhance partialFindings with common properties shared accross all sslyze findings
    const findings = partialFindings.map(partialFinding => {
        return {
            osi_layer: 'PRESENTATION',
            reference: null,
            location,
            ...partialFinding,
            attributes: {
                hostname,
                ip_address,
                port,
                ...(partialFinding.attributes || {}),
            },
        };
    });

    return findings;
}

module.exports.parse = parse;

// Returns the Scan Result for the individual TLS Versions as array
function getTlsScanResultsAsArray(serverScanResult) {
    const commandResult = serverScanResult.scan_commands_results;

    return [
        { name: 'SSL 2.0', ...commandResult.ssl_2_0_cipher_suites },
        { name: 'SSL 3.0', ...commandResult.ssl_3_0_cipher_suites },
        { name: 'TLS 1.0', ...commandResult.tls_1_0_cipher_suites },
        { name: 'TLS 1.1', ...commandResult.tls_1_1_cipher_suites },
        { name: 'TLS 1.2', ...commandResult.tls_1_2_cipher_suites },
        { name: 'TLS 1.3', ...commandResult.tls_1_3_cipher_suites },
    ];
}

// Returns all supported cipher suites accoress all tls and ssl version as one big string array
function getAllAcceptedCipherSuites(serverScanResult) {
    const tlsScanResults = getTlsScanResultsAsArray(serverScanResult);

    // Use set to eliminate duplicates automatically
    const supportedVersions = new Set();

    for (const tlsScanResult of tlsScanResults) {
        for (const acceptedCipherSuit of tlsScanResult.accepted_cipher_suites) {
            supportedVersions.add(acceptedCipherSuit.cipher_suite.openssl_name);
        }
    }

    // return set as a array
    return [...supportedVersions.values()];
}

// Returns all supported tls versions as a string array
function getAllSupportedTlsVersions(serverScanResult) {
    const tlsScanResults = getTlsScanResultsAsArray(serverScanResult);

    const supportedVersions = [];

    for (const tlsScanResult of tlsScanResults) {
        // Should have at least one accepted cipher suite to be considered "supported"
        if (tlsScanResult.accepted_cipher_suites.length > 0) {
            supportedVersions.push(tlsScanResult.name);
        }
    }

    return supportedVersions;
}

function generateInformationalServiceFinding(serverScanResult) {
    return {
        name: 'TLS Service',
        description: '',
        category: 'TLS Service Info',
        severity: 'INFORMATIONAL',
        hint: null,
        attributes: {
            tls_versions: getAllSupportedTlsVersions(serverScanResult),
            cipher_suites: getAllAcceptedCipherSuites(serverScanResult),
        },
    };
}

function generateVulnarableTLSVersionFindings(serverScanResult) {
    const supportedTlsVersions = getAllSupportedTlsVersions(serverScanResult);

    const DEPRECATED_VERSIONS = ['SSL 2.0', 'SSL 3.0', 'TLS 1.0', 'TLS 1.1'];

    const findings = supportedTlsVersions
        .filter(tlsVersion => DEPRECATED_VERSIONS.includes(tlsVersion))
        .map(tlsVersion => {
            return {
                name: `TLS Version ${tlsVersion} is considered insecure`,
                category: 'Outdated TLS Version',
                description: 'The server uses outdated or unsecure tls versions.',
                severity: 'MEDIUM',
                hint: 'Upgrade to a higher tls version.',
                attributes: {
                    outdated_version: tlsVersion,
                },
            };
        });

    return findings;
}

// const deployments = [
//     {
//         'matchesHostname': true,
//         trustStores: [
//             {
//                 openSslErrorString: 'self-signed',
//                 name: 'Android',
//             },
//             {
//                 openSslErrorString: null,
//                 name: 'ios',
//             },
//         ]
//     }, => { trused: false, self-signed: true, }
//     {
//         'matchesHostname': true,
//         trustStores: [
//             {
//                 openSslErrorString: null,
//                 name: 'Android',
//             },
//             {
//                 openSslErrorString: null,
//                 name: 'ios',
//             },
//         ]
//     }, => { trused: true, self-signed: false, }
// ] => []

function analyseCertificateDeployments(serverScanResult) {
    const certificateInfos = serverScanResult.scan_commands_results.certificate_info.certificate_deployments.map(
        analyseCertificateDeployment
    );

    // If at least one cert is totally trusted no finding should be created
    if (certificateInfos.every(certInfo => certInfo.trusted)) {
        return [];
    }

    // No Cert Deployment is trused creating individual findings

    const findingTemplates = [];
    for (const certInfo of certificateInfos) {
        if (certInfo.matchesHostname === false) {
            findingTemplates.push({ name: 'Wrong Hostname' });
        }
    }
}

function analyseCertificateDeployment(certificateDeployment) {
    const errorsAcrossAllTruststores = new Set();

    for (const validationResult of certificateDeployment.path_validation_results) {
        errorsAcrossAllTruststores.add(validationResult.openssl_error_string);
    }

    const matchesHostname = certificateDeployment.leaf_certificate_subject_matches_hostname;

    return {
        // To be trusted no openssl erros should have occured and should match hostname
        trusted: errorsAcrossAllTruststores.size === 0 && matchesHostname,
        matchesHostname,
        selfSigned: errorsAcrossAllTruststores.has('self signed certificate'),
        expired: errorsAcrossAllTruststores.has('certificate has expired'),
        untrusedRoot: errorsAcrossAllTruststores.has(
            'self signed certificate in certificate chain'
        ),
    };
}

// Category: "Invalid Certificate"
// Name: "Self-Signed Certificate"
// Name: "Expired Certificate"
// Name: "Untrusted Certificate Root"
// Name: "Wrong Host"
// Name: "Certificate Revoked"
