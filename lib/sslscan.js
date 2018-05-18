/*
 *
 *  SecureCodeBox (SCB)
 *  Copyright 2015-2018 iteratec GmbH
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 * /
 */
const nodeSSLyze = require('./node-sslyze');

function scanTarget(target, params) {
    return new Promise((resolve, reject) => {
        const sslScanner = new nodeSSLyze.RegularScan(target, params);

        sslScanner.on('complete', data => resolve({res : data, raw : sslScanner.rawJSON}));
        sslScanner.on('error', reject);

        sslScanner.startScan();
    });
}

let sslscan = {
    scanTarget: scanTarget,
    testRun: () => scanTarget('www.yahoo.com:443')
};

module.exports = sslscan;
