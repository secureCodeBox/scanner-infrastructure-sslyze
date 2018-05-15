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
const ScannerScaffolding = require('@securecodebox/scanner-scaffolding');
const { worker } = require('./src/sslyze');
const { testRun } = require('./lib/sslyze');

const scanner = new ScannerScaffolding(worker, {
    engineAddress: 'http://localhost:8080',
    workername: 'sslyze',
    topic: 'sslyze_scan',
    async testScannerFunctionality() {
        try {
            await testRun();
        } catch (error) {
            return { version: 'unkown', testRun: 'failed' };
        }
        return {
            version: 'unkown',
            testRun: 'successful',
        };
    },
});

scanner.startStatusServer();
