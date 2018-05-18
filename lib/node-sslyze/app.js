var sslyze = require('./index');
var scanner = new sslyze.RegularScan("127.0.0.");

scanner.on('complete', function (data) {
    console.log("Scan completed.");
    console.log("Data: " + JSON.stringify(data, null, 2));
    //console.log("Raw data: " + JSON.stringify(scanner.rawJSON));
    console.log("Total scan time: " + (scanner.scanTime/1000) + " sec.");
});

scanner.on('error', function (data) {
    console.log("Scan threw an error.");
    console.log("Error: " + JSON.stringify(data, null, 2));
});

console.log('Scan starting.');
scanner.startScan();