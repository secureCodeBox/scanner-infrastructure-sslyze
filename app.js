var sslyze_worker = require('./src/sslyze');

async function execute_worker() {
    let result = await sslyze_worker.worker([
        {
            location: 'www.yahoo.com',
        },
    ]);

    console.log(JSON.stringify(result.result, null, 2));
}

execute_worker();
