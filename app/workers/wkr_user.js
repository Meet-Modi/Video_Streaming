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
    const user = new User(job.data.user);
    try {
        await user.save()
        const token = await user.generateAuthToken()
        result = { user, token };
        console.log(result);
        done(null, result);
    } catch (error) {
        done(new Error('User not created'));
    }
});

queue.process(CONST.WKR_LOGIN_USER, async (job, done) => {
    const user = new User(job.data.user);
    try {
        const user = await User.findByCredentials(
            job.data.user.email,
            job.data.user.password
        )
        const token = await user.generateAuthToken()
        done(null, { user, token });
    } catch (error) {
        done(new Error('Invalid Credentials'));
    }
});
