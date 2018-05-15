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

const sslyzeScan = require('../lib/sslyze');

/**
 * Transforms the raw SSLyze result into the SecureCodeBox Finding Format
 *
 * @param {array<host>} hosts An array of hosts
 */
function transform(hosts) {
    return hosts;
}

function joinResults(results) {
    const findings = _.flatMap(results, result => result.findings);
    const rawFindings = _.map(results, result => result.raw);

    return {
        result: findings,
        raw: rawFindings,
    };
}

async function worker(targets) {
    console.log(`SCANNING ${targets.length} locations`);
    const results = [];

    for (const { location, attributes } of targets) {
        try {
            const parameter = _.get(attributes, ['SSLYZE_PARAMETER'], '');

            console.log(`SCANNING location: ${location}, parameters:${parameter}`);
            const rawResult = await sslyzeScan(location, parameter);
            const findings = transform(rawResult);

            results.push({ findings, raw: rawResult });
        } catch (err) {
            console.error(err);
            throw new Error('Failed to execute sslyze scan.');
        }
    }

    return joinResults(results);
}

module.exports.transform = transform;
module.exports.worker = worker;
