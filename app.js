var sslyze_worker = require('./src/sslyze');

async function execute_worker() {
    let result = await sslyze_worker.worker([
        {
            location: "www.yahoo.com",
            attributes: {
                
            }
        }
    ]);

    console.log(JSON.stringify(result.result, null, 2));
}

execute_worker();
