/*
 * NodeJS <-> SSLyze interface
 * Author:  John Horton, Victor-Philipp Negoescu
 * Purpose: Create an interface for NodeJS applications to make use of SSLyze installed on the local system.
 */

const child_process = require('child_process');
//const execSync = child_process.execSync;
//const exec = child_process.exec;
const spawn = child_process.spawn;
const EventEmitter = require('events').EventEmitter;

/**
 * Generic stateful SSLyze scan process representation.
 *
 * This class is not meant to be instantiated directly. Instead,
 * subclasses should provide their own constructors that supply
 * additional parameters to SSLyze.
 */
class SSLyzeScan extends EventEmitter {
    /**
     * Constructor
     * @param {*} hosts hosts to scan, either separated by spaces or given as an array of strings
     * @param {*} scanArgs arguments passed to SSLyze
     */
    constructor(hosts, scanArgs) {
        super();
        this.command = [];
        this.sslyzeOutputXML = '';
        this.timer;
        this.hosts = [];
        this.arguments = ['-m', 'sslyze', '--json_out=-'];
        this.rawData = '';
        this.rawJSON;
        this.child;
        this.cancelled = false;
        this.scanTime = 0;
        this.error = null;
        this.scanResults;
        this.scanTimeout = 0;
        this.processUserArgs(hosts, scanArgs);
        this.initChild();
    }

    /**
     * Parses the given target hosts and scan arguments which were provided by the user.
     *
     * @param {*} hosts hosts to scan, either separated by spaces or given as an array of strings
     * @param {*} scanArgs arguments passed to SSLyze
     */
    processUserArgs(hosts, scanArgs) {
        // add custom scan arguments
        if (scanArgs) {
            if (!Array.isArray(scanArgs)) {
                scanArgs = scanArgs.split(' ');
            }
            this.command = this.arguments.concat(scanArgs);
        } else {
            this.command = this.arguments;
        }

        // handle and store provided hosts
        if (!Array.isArray(hosts)) {
            hosts = hosts.split(' ');
        }
        this.hosts = hosts;
        this.command = this.command.concat(this.hosts);
    }

    /**
     * Starts the timer for measuring total scan duration.
     */
    startTimer() {
        this.timer = setInterval(() => {
            this.scanTime += 10;
            if (this.scanTime >= this.scanTimeout && this.scanTimeout !== 0) {
                this.killChild();
            }
        }, 10);
    }

    /**
     * Stops the timer.
     */
    stopTimer() {
        clearInterval(this.timer);
    }

    /**
     * Forcefully stops the scan process.
     */
    killChild() {
        this.cancelled = true;
        if (this.child) {
            this.child.kill();
        }
    }

    /**
     * Initializes the scan process.
     */
    initChild() {
        this.startTimer();
        console.log(
            'Initializing child: ' + sslyze.pythonLocation + ' with arguments ' + this.command
        );
        this.child = spawn(sslyze.pythonLocation, this.command);
        process.on('SIGINT', this.killChild);
        process.on('uncaughtException', this.killChild);
        process.on('exit', this.killChild);
        this.child.stdout.on('data', data => {
            this.rawData += data;
        });

        this.child.on('error', err => {
            this.killChild();
            if (err.code === 'ENOENT') {
                this.emit(
                    'error',
                    'Python not found at command location: ' + sslyze.pythonLocation
                );
            } else {
                this.emit('error', err.Error);
            }
        });

        this.child.stderr.on('data', err => {
            this.error = err.toString();
        });

        this.child.on('close', () => {
            process.removeListener('SIGINT', this.killChild);
            process.removeListener('uncaughtException', this.killChild);
            process.removeListener('exit', this.killChild);

            if (this.error) {
                this.emit('error', this.error);
            } else if (this.cancelled === true) {
                this.emit('error', 'Over scan timeout ' + this.scanTimeout);
            } else {
                this.rawDataHandler(this.rawData);
            }
        });
    }

    /**
     * Starts the scan process
     */
    startScan() {
        this.child.stdin.end();
    }

    /**
     * Cancels the scan process
     */
    cancelScan() {
        this.killChild();
        this.emit('error', 'Scan cancelled');
    }

    /**
     * Processes scan results after completion
     * @param {*} results scan results
     */
    scanComplete(results) {
        this.scanResults = results;
        this.stopTimer();
        this.emit('complete', this.scanResults);
        this.killChild();
    }

    /**
     * Parses the JSON output of SSLyze
     * @param {*} data
     */
    rawDataHandler(data) {
        this.rawJSON = data;

        let results = null;
        try {
            results = JSON.parse(data);
        } catch (e) {
            this.emit('error', 'Error parsing SSLyze JSON output: ' + e);
        }
        this.scanComplete(results);
    }
}

class RegularScan extends SSLyzeScan {
    constructor(hosts) {
        super(hosts, '--regular');
    }
}

let sslyze = {
    pythonLocation: 'python3',
    RegularScan,
};

module.exports = sslyze;
