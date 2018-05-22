var //should = require('chai').should(),
    assert = require('assert'),
    expect = require('chai').expect,
    sslyze = require('../index');

describe('RegularScan', function() {
    it('runs SSLyze', function(done) {
        this.timeout(300000);
        var scan = new sslyze.RegularScan('yahoo.com');
        scan.on('complete', function(data) {
            expect(data).to.be.instanceOf(Object);
            expect(data).to.not.be.empty;
            expect(data).to.include.keys(
                'accepted_targets',
                'invalid_targets',
                'sslyze_url',
                'sslyze_version',
                'total_scan_time'
            );
            expect(data.accepted_targets).to.be.instanceOf(Array);
            assert(data.accepted_targets.length == 1);
            expect(data.invalid_targets).to.be.instanceOf(Array);
            assert(data.invalid_targets.length == 0);
            done();
        });
        scan.startScan();
    });

    it('accepts multiple space separated hosts', function(done) {
        this.timeout(300000);
        var scan = new sslyze.RegularScan('invalidhostname yahoo.com');
        scan.on('complete', function(data) {
            expect(data).to.be.instanceOf(Object);
            expect(data).to.not.be.empty;
            expect(data).to.include.keys(
                'accepted_targets',
                'invalid_targets',
                'sslyze_url',
                'sslyze_version',
                'total_scan_time'
            );
            expect(data.accepted_targets).to.be.instanceOf(Array);
            assert(data.accepted_targets.length == 1);
            expect(data.invalid_targets).to.be.instanceOf(Array);
            assert(data.invalid_targets.length == 1);
            done();
        });
        scan.startScan();
    });

    it('accepts multiple hosts in array', function(done) {
        this.timeout(300000);
        var scan = new sslyze.RegularScan(['invalidhostname', 'yahoo.com']);
        scan.on('complete', function(data) {
            expect(data).to.be.instanceOf(Object);
            expect(data).to.not.be.empty;
            expect(data).to.include.keys(
                'accepted_targets',
                'invalid_targets',
                'sslyze_url',
                'sslyze_version',
                'total_scan_time'
            );
            expect(data.accepted_targets).to.be.instanceOf(Array);
            assert(data.accepted_targets.length == 1);
            expect(data.invalid_targets).to.be.instanceOf(Array);
            assert(data.invalid_targets.length == 1);
            done();
        });
        scan.startScan();
    });

    it('returns failure data for bad requests', function(done) {
        this.timeout(300000);
        var scan = new sslyze.RegularScan('127.0.0.');
        scan.on('complete', function(data) {
            expect(data).to.be.instanceOf(Object);
            expect(data).to.not.be.empty;
            expect(data).to.include.keys(
                'accepted_targets',
                'invalid_targets',
                'sslyze_url',
                'sslyze_version',
                'total_scan_time'
            );
            expect(data.accepted_targets).to.be.instanceOf(Array);
            assert(data.accepted_targets.length == 0);
            expect(data.invalid_targets).to.be.instanceOf(Array);
            assert(data.invalid_targets.length == 1);
            done();
        });
        scan.startScan();
    });
});
