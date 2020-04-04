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
            cipher_suites: ["CAMELLIA256-SHA", "CAMELLIA128-SHA", "AES256-SHA", "AES128-SHA", "ECDHE-RSA-AES256-SHA", "ECDHE-RSA-AES128-SHA", "DHE-RSA-CAMELLIA256-SHA", "DHE-RSA-CAMELLIA128-SHA", "DHE-RSA-AES256-SHA", "DHE-RSA-AES128-SHA"],
        },
    });
    
    expect(findings).toContainEqual({
        name: 'TLS Version TLS 1.0 is considered insecure',
        category: 'Outdated TLS Version',
        description: 'The server uses outdated or unsecure tls versions.',
        severity: 'MEDIUM',
        hint: 'Upgrade to a higher tls version.',
        osi_layer: 'PRESENTATION',
        reference: null,
        location: 'tls-v1-0.badssl.com:1010',
        attributes: {
            hostname: 'tls-v1-0.badssl.com',
            ip_address: '104.154.89.105',
            port: 1010,
            outdated_version: 'TLS 1.0'
        },
    });
});
