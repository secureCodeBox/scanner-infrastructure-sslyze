const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const { parse } = require('./parser');

test('parses result file for www.securecodebox.io correctly', async () => {
    const fileContent = JSON.parse(
        await readFile(__dirname + '/__testFiles__/www.securecodebox.io.json', {
            encoding: 'utf8',
        })
    );

    const findings = await parse(fileContent);

    expect(findings).toContainEqual({
        name: 'TLS Service',
        category: 'TLS Service Info',
        description: '',
        severity: 'INFORMATIONAL',
        osi_layer: 'PRESENTATION',
        hint: null,
        reference: null,
        location: 'www.securecodebox.io:443',
        attributes: {
            hostname: 'www.securecodebox.io',
            ip_address: '185.199.109.153',
            port: 443,
            tls_versions: ['TLS 1.2'],
            cipher_suites: [
                'AES256-SHA',
                'AES128-GCM-SHA256',
                'AES128-SHA',
                'ECDHE-RSA-AES256-GCM-SHA384',
                'ECDHE-RSA-AES256-SHA384',
                'ECDHE-RSA-AES256-SHA',
                'ECDHE-RSA-AES128-GCM-SHA256',
                'ECDHE-RSA-AES128-SHA256',
                'ECDHE-RSA-AES128-SHA',
            ],
        },
    });

    expect(findings.length).toEqual(1);
});

test('parses result file for tls-v1-0.badssl.com:1010 correctly', async () => {
    const fileContent = JSON.parse(
        await readFile(__dirname + '/__testFiles__/tls-v1-0.badssl.com_1010.json', {
            encoding: 'utf8',
        })
    );

    const findings = await parse(fileContent);

    expect(findings).toContainEqual({
        name: 'TLS Service',
        category: 'TLS Service Info',
        description: '',
        severity: 'INFORMATIONAL',
        osi_layer: 'PRESENTATION',
        hint: null,
        reference: null,
        location: 'tls-v1-0.badssl.com:1010',
        attributes: {
            hostname: 'tls-v1-0.badssl.com',
            ip_address: '104.154.89.105',
            port: 1010,
            tls_versions: ['TLS 1.0'],
            cipher_suites: [
                'CAMELLIA256-SHA',
                'CAMELLIA128-SHA',
                'AES256-SHA',
                'AES128-SHA',
                'ECDHE-RSA-AES256-SHA',
                'ECDHE-RSA-AES128-SHA',
                'DHE-RSA-CAMELLIA256-SHA',
                'DHE-RSA-CAMELLIA128-SHA',
                'DHE-RSA-AES256-SHA',
                'DHE-RSA-AES128-SHA',
            ],
        },
    });

    expect(findings).toContainEqual({
        name: 'TLS Version TLS 1.0 is considered insecure',
        category: 'Outdated TLS Version',
        description: 'The server uses outdated or insecure tls versions.',
        severity: 'MEDIUM',
        hint: 'Upgrade to a higher tls version.',
        osi_layer: 'PRESENTATION',
        reference: null,
        location: 'tls-v1-0.badssl.com:1010',
        attributes: {
            hostname: 'tls-v1-0.badssl.com',
            ip_address: '104.154.89.105',
            port: 1010,
            outdated_version: 'TLS 1.0',
        },
    });

    expect(findings.length).toEqual(2);
});

test('parses result file for expired.badssl.com correctly', async () => {
    const fileContent = JSON.parse(
        await readFile(__dirname + '/__testFiles__/expired.badssl.com.json', {
            encoding: 'utf8',
        })
    );

    const findings = await parse(fileContent);

    expect(findings).toContainEqual({
        name: 'TLS Service',
        category: 'TLS Service Info',
        description: '',
        severity: 'INFORMATIONAL',
        osi_layer: 'PRESENTATION',
        hint: null,
        reference: null,
        location: 'expired.badssl.com:443',
        attributes: {
            hostname: 'expired.badssl.com',
            ip_address: '104.154.89.105',
            port: 443,
            tls_versions: ['TLS 1.0', 'TLS 1.1', 'TLS 1.2'],
            cipher_suites: [
                'CAMELLIA256-SHA',
                'CAMELLIA128-SHA',
                'AES256-SHA',
                'AES128-SHA',
                'DES-CBC3-SHA',
                'ECDHE-RSA-AES256-SHA',
                'ECDHE-RSA-AES128-SHA',
                'ECDHE-RSA-DES-CBC3-SHA',
                'DHE-RSA-CAMELLIA256-SHA',
                'DHE-RSA-CAMELLIA128-SHA',
                'DHE-RSA-AES256-SHA',
                'DHE-RSA-AES128-SHA',
                'AES256-GCM-SHA384',
                'AES256-SHA256',
                'AES128-GCM-SHA256',
                'AES128-SHA256',
                'ECDHE-RSA-AES256-GCM-SHA384',
                'ECDHE-RSA-AES256-SHA384',
                'ECDHE-RSA-AES128-GCM-SHA256',
                'ECDHE-RSA-AES128-SHA256',
                'DHE-RSA-AES256-GCM-SHA384',
                'DHE-RSA-AES256-SHA256',
                'DHE-RSA-AES128-GCM-SHA256',
                'DHE-RSA-AES128-SHA256',
            ],
        },
    });

    expect(findings).toContainEqual({
        name: 'Expired Certificate',
        description: 'Certificate has expired',
        category: 'Invalid Certificate',
        severity: 'MEDIUM',
        location: 'expired.badssl.com:443',
        attributes: {
            hostname: 'expired.badssl.com',
            ip_address: '104.154.89.105',
            port: 443,
        },
        hint: null,
        osi_layer: 'PRESENTATION',
        reference: null,
    });
});

test('parses result file for wrong.host.badssl.com correctly', async () => {
    const fileContent = JSON.parse(
        await readFile(__dirname + '/__testFiles__/wrong.host.badssl.com.json', {
            encoding: 'utf8',
        })
    );

    const findings = await parse(fileContent);

    expect(findings).toContainEqual({
        name: 'TLS Service',
        category: 'TLS Service Info',
        description: '',
        severity: 'INFORMATIONAL',
        osi_layer: 'PRESENTATION',
        hint: null,
        reference: null,
        location: 'wrong.host.badssl.com:443',
        attributes: {
            hostname: 'wrong.host.badssl.com',
            ip_address: '104.154.89.105',
            port: 443,
            tls_versions: ['TLS 1.0', 'TLS 1.1', 'TLS 1.2'],
            cipher_suites: [
                'CAMELLIA256-SHA',
                'CAMELLIA128-SHA',
                'AES256-SHA',
                'AES128-SHA',
                'DES-CBC3-SHA',
                'ECDHE-RSA-AES256-SHA',
                'ECDHE-RSA-AES128-SHA',
                'ECDHE-RSA-DES-CBC3-SHA',
                'DHE-RSA-CAMELLIA256-SHA',
                'DHE-RSA-CAMELLIA128-SHA',
                'DHE-RSA-AES256-SHA',
                'DHE-RSA-AES128-SHA',
                'AES256-GCM-SHA384',
                'AES256-SHA256',
                'AES128-GCM-SHA256',
                'AES128-SHA256',
                'ECDHE-RSA-AES256-GCM-SHA384',
                'ECDHE-RSA-AES256-SHA384',
                'ECDHE-RSA-AES128-GCM-SHA256',
                'ECDHE-RSA-AES128-SHA256',
                'DHE-RSA-AES256-GCM-SHA384',
                'DHE-RSA-AES256-SHA256',
                'DHE-RSA-AES128-GCM-SHA256',
                'DHE-RSA-AES128-SHA256',
            ],
        },
    });

    expect(findings).toContainEqual({
        name: 'Invalid Hostname',
        description: "Hostname of Server didn't match the certificates subject names",
        category: 'Invalid Certificate',
        severity: 'MEDIUM',
        location: 'wrong.host.badssl.com:443',
        attributes: {
            hostname: 'wrong.host.badssl.com',
            ip_address: '104.154.89.105',
            port: 443,
        },
        hint: null,
        osi_layer: 'PRESENTATION',
        reference: null,
    });
});

test('parses result file for untrusted-root.badssl.com correctly', async () => {
    const fileContent = JSON.parse(
        await readFile(__dirname + '/__testFiles__/untrusted-root.badssl.com.json', {
            encoding: 'utf8',
        })
    );

    const findings = await parse(fileContent);

    expect(findings).toContainEqual({
        name: 'TLS Service',
        category: 'TLS Service Info',
        description: '',
        severity: 'INFORMATIONAL',
        osi_layer: 'PRESENTATION',
        hint: null,
        reference: null,
        location: 'untrusted-root.badssl.com:443',
        attributes: {
            hostname: 'untrusted-root.badssl.com',
            ip_address: '104.154.89.105',
            port: 443,
            tls_versions: ['TLS 1.0', 'TLS 1.1', 'TLS 1.2'],
            cipher_suites: [
                'CAMELLIA256-SHA',
                'CAMELLIA128-SHA',
                'AES256-SHA',
                'AES128-SHA',
                'DES-CBC3-SHA',
                'ECDHE-RSA-AES256-SHA',
                'ECDHE-RSA-AES128-SHA',
                'ECDHE-RSA-DES-CBC3-SHA',
                'DHE-RSA-CAMELLIA256-SHA',
                'DHE-RSA-CAMELLIA128-SHA',
                'DHE-RSA-AES256-SHA',
                'DHE-RSA-AES128-SHA',
                'AES256-GCM-SHA384',
                'AES256-SHA256',
                'AES128-GCM-SHA256',
                'AES128-SHA256',
                'ECDHE-RSA-AES256-GCM-SHA384',
                'ECDHE-RSA-AES256-SHA384',
                'ECDHE-RSA-AES128-GCM-SHA256',
                'ECDHE-RSA-AES128-SHA256',
                'DHE-RSA-AES256-GCM-SHA384',
                'DHE-RSA-AES256-SHA256',
                'DHE-RSA-AES128-GCM-SHA256',
                'DHE-RSA-AES128-SHA256',
            ],
        },
    });

    expect(findings).toContainEqual({
        name: 'Untrusted Certificate Root',
        description: 'The certificate chain contains a certificate not trusted ',
        category: 'Invalid Certificate',
        severity: 'MEDIUM',
        location: 'untrusted-root.badssl.com:443',
        attributes: {
            hostname: 'untrusted-root.badssl.com',
            ip_address: '104.154.89.105',
            port: 443,
        },
        hint: null,
        osi_layer: 'PRESENTATION',
        reference: null,
    });
});

test('parses result file for self-signed.badssl.com correctly', async () => {
    const fileContent = JSON.parse(
        await readFile(__dirname + '/__testFiles__/self-signed.badssl.com.json', {
            encoding: 'utf8',
        })
    );

    const findings = await parse(fileContent);

    expect(findings).toContainEqual({
        name: 'TLS Service',
        category: 'TLS Service Info',
        description: '',
        severity: 'INFORMATIONAL',
        osi_layer: 'PRESENTATION',
        hint: null,
        reference: null,
        location: 'self-signed.badssl.com:443',
        attributes: {
            hostname: 'self-signed.badssl.com',
            ip_address: '104.154.89.105',
            port: 443,
            tls_versions: ['TLS 1.0', 'TLS 1.1', 'TLS 1.2'],
            cipher_suites: [
                'CAMELLIA256-SHA',
                'CAMELLIA128-SHA',
                'AES256-SHA',
                'AES128-SHA',
                'DES-CBC3-SHA',
                'ECDHE-RSA-AES256-SHA',
                'ECDHE-RSA-AES128-SHA',
                'ECDHE-RSA-DES-CBC3-SHA',
                'DHE-RSA-CAMELLIA256-SHA',
                'DHE-RSA-CAMELLIA128-SHA',
                'DHE-RSA-AES256-SHA',
                'DHE-RSA-AES128-SHA',
                'AES256-GCM-SHA384',
                'AES256-SHA256',
                'AES128-GCM-SHA256',
                'AES128-SHA256',
                'ECDHE-RSA-AES256-GCM-SHA384',
                'ECDHE-RSA-AES256-SHA384',
                'ECDHE-RSA-AES128-GCM-SHA256',
                'ECDHE-RSA-AES128-SHA256',
                'DHE-RSA-AES256-GCM-SHA384',
                'DHE-RSA-AES256-SHA256',
                'DHE-RSA-AES128-GCM-SHA256',
                'DHE-RSA-AES128-SHA256',
            ],
        },
    });

    expect(findings).toContainEqual({
        name: 'Self-Signed Certificate',
        description: 'Certificate is self-signed',
        category: 'Invalid Certificate',
        severity: 'MEDIUM',
        location: 'self-signed.badssl.com:443',
        attributes: {
            hostname: 'self-signed.badssl.com',
            ip_address: '104.154.89.105',
            port: 443,
        },
        hint: null,
        osi_layer: 'PRESENTATION',
        reference: null,
    });
});

test('parses an empty result file correctly', async () => {
    const fileContent = JSON.parse(
        await readFile(__dirname + '/__testFiles__/unavailible-host.json', {
            encoding: 'utf8',
        })
    );

    const findings = await parse(fileContent);

    expect(findings).toEqual([]);
});

test('parses an result file with mixed connectivity correctly', async () => {
    const fileContent = JSON.parse(
        await readFile(__dirname + '/__testFiles__/mixed-connectivity-result.json', {
            encoding: 'utf8',
        })
    );

    const findings = await parse(fileContent);

    expect(findings).toEqual([]);
});

test('parses heartbleed result file correctly', async () => {
    const fileContent = JSON.parse(
        await readFile(__dirname + '/__testFiles__/heartbleed-vulnerable.json', {
            encoding: 'utf8',
        })
    );

    const findings = await parse(fileContent);

    expect(findings).toContainEqual({
        name: 'Heartbleed',
        description: 'TLS Service is vulnerable to Heartbleed',
        category: 'TLS Vulnerability',
        severity: 'HIGH',
        location: 'www.securecodebox.io:443',
        attributes: {
            hostname: 'www.securecodebox.io',
            ip_address: '185.199.109.153',
            port: 443,
        },
        osi_layer: 'PRESENTATION',
        reference: {
            id: 'CVE-2014-0160',
            source: 'https://nvd.nist.gov/vuln/detail/CVE-2014-0160',
        },
    });
});

test('parses ccs injection result file correctly', async () => {
    const fileContent = JSON.parse(
        await readFile(__dirname + '/__testFiles__/ccs-vulnerable.json', {
            encoding: 'utf8',
        })
    );

    const findings = await parse(fileContent);

    expect(findings).toContainEqual({
        name: 'CCS Injection',
        description: 'TLS Service is vulnerable to CCS Injection',
        category: 'TLS Vulnerability',
        severity: 'HIGH',
        location: 'www.securecodebox.io:443',
        attributes: {
            hostname: 'www.securecodebox.io',
            ip_address: '185.199.109.153',
            port: 443,
        },
        osi_layer: 'PRESENTATION',
        reference: {
            id: 'CVE-2014-0224',
            source: 'https://nvd.nist.gov/vuln/detail/CVE-2014-0224',
        },
    });
});

test('parses robot vulnerable result file correctly', async () => {
    const fileContent = JSON.parse(
        await readFile(__dirname + '/__testFiles__/robot-vulnerable.json', {
            encoding: 'utf8',
        })
    );

    const findings = await parse(fileContent);

    expect(findings).toContainEqual({
        name: 'ROBOT',
        description: 'TLS Service is vulnerable to ROBOT Attacks',
        category: 'TLS Vulnerability',
        severity: 'HIGH',
        location: 'www.securecodebox.io:443',
        attributes: {
            hostname: 'www.securecodebox.io',
            ip_address: '185.199.109.153',
            port: 443,
        },
        osi_layer: 'PRESENTATION',
        reference: {
            id: 'CVE-2017-13099',
            source: 'https://nvd.nist.gov/vuln/detail/CVE-2017-13099',
        },
    });
});

test('parses weak robot vulnerable result file correctly', async () => {
    const fileContent = JSON.parse(
        await readFile(__dirname + '/__testFiles__/robot-weak-vulnerable.json', {
            encoding: 'utf8',
        })
    );

    const findings = await parse(fileContent);

    expect(findings).toContainEqual({
        name: 'ROBOT Weak',
        description:
            'TLS Service is vulnerable to ROBOT Attacks, but an Attack against this server would require a currently unrealistic computational capacity',
        category: 'TLS Vulnerability',
        severity: 'MEDIUM',
        location: 'www.securecodebox.io:443',
        attributes: {
            hostname: 'www.securecodebox.io',
            ip_address: '185.199.109.153',
            port: 443,
        },
        osi_layer: 'PRESENTATION',
        reference: {
            id: 'CVE-2017-13099',
            source: 'https://nvd.nist.gov/vuln/detail/CVE-2017-13099',
        },
    });
});
