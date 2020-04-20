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
const uuid = require('uuid/v4');
const sslscan = require('../lib/sslscan');
const { parse } = require('./parser');

/**
 * Main worker method
 * @param {*} targets array or space seperated list of target hosts
 */
async function worker(targets) {
    const findings = [];

    console.log(`SCANNING ${targets.length} locations`);
    let i = 0;
    for (const { location, attributes = {} } of targets) {
        try {
            const parameter = attributes.SSLYZE_PARAMETER || '';

            console.log(
                `SCANNING location (${i++}/${targets.length}): ${location}, parameters:${parameter}`
            );
            const { res: scanResult } = await sslscan.scanTarget(location, parameter);

            findings.push(...parse(scanResult));
        } catch (err) {
            console.error('Scan errored:');
            console.error(err);
            throw new Error('Failed to execute SSLyze scan.');
        }
    }

    return {
        result: findings.map((finding) => {
            return { id: uuid(), ...finding };
        }),
    };
}

module.exports.worker = worker;
