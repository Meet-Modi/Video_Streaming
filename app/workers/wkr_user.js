const User = require('../models/user')
const mongoose = require('mongoose').set('debug', true);
const auth = require('../middleware/auth')

const CONFIG = require('../helpers/config.js');
const CONST = require('../helpers/constant.js');
const kue = require('kue');
const queue = kue.createQueue({ redis: CONFIG.database.redis });
queue.setMaxListeners(100000);

mongoose.connect(process.env.NODE_ENV === 'DEVELOPMENT' ? CONFIG.DB_URI_DEV : CONFIG.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    socketTimeoutMS: 3000,
    keepAlive: true,
    reconnectTries: 3000,
})
    .then(
        function () {
            //connected successfully
            console.log('Database connection successful!');
        },
        function (err) {
            console.log(err);
        }
    );

queue.process(CONST.WKR_FETCH_NEW_USER, async (job, done) => {
    console.log("--------------------------------new user process called");
    console.log("-----------" + job.data.user.name);
    const user = new User(job.data.user);
    try {
        await user.save()
        const token = await user.generateAuthToken()
        console.log({ user, token });
    } catch (error) {
        console.log("Error");
    }
    done();
});
