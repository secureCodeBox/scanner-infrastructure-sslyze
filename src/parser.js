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

    const VULNARABLE_VERSIONS = ['SSL 2.0', 'SSL 3.0', 'TLS 1.0'];

    const findings = supportedTlsVersions
        .filter(tlsVersion => VULNARABLE_VERSIONS.includes(tlsVersion))
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
