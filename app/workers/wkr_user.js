const CONFIG = require('../helpers/config');
const CONST = require('../helpers/constant');
const kue = require('kue');
const queue = kue.createQueue({ redis: CONFIG.database.redis });
queue.setMaxListeners(100000);
kue.app.listen(8081);

queue.process(CONST.WKR_FETCH_NEW_USER, async (job, done) => {
    console.log("--------------------------------new user process called");
    console.log("-----------" + job.data.time);
    .then(
        done();
    )

done();
});
