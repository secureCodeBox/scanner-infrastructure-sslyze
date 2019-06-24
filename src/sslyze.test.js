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
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

jest.mock('../lib/sslscan');

async function readFileForSite(site) {
    const fileContents = await readFile(`src/__testFiles__/${site}.json`, {
        encoding: 'utf8',
    });
    return JSON.parse(fileContents);
}

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

        // In case of JSON Format changes regen the json file by running
        // sslyze --regular expired.badssl.com --json_out=src/__testFiles__/expired.badssl.com.com.json
        it('should transform a result with an expired certificate', async function() {
            const results = await readFileForSite('expired.badssl.com');

            const findings = transform(results);
            expect(findings).toMatchSnapshot();
        });

        // In case of JSON Format changes regen the json file by running
        // sslyze --regular securecodebox.io --json_out=src/__testFiles__/securecodebox.io.com.json
        it('should transform a valid certificate', async function() {
            const results = await readFileForSite('securecodebox.io');

            const findings = transform(results);
            expect(findings).toMatchSnapshot();
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
