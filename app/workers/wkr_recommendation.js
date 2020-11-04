const CONFIG = require('../helpers/config.js');
const CONST = require('../helpers/constant.js');

const Genre = require('../models/genre')
const Video = require('../models/video');
const Cast = require('../models/cast');
const mongoose = require('mongoose').set('debug', true);

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

queue.process(CONST.WKR_SEARCH_TERM, async (job, done) => {
    const term = job.data.term;
    try {
        var search_result = [];
        // GENRE SEARCH QUERY
        var result = await Genre.find({ name: term });
        var genre_id = 0;
        if (result.length > 0) {
            genre_id = result[0]._id;
        }
        var result_1 = await Video.find({ genreIds: genre_id });
        if (result_1.length > 0) {
            result_1.forEach(element => {
                search_result.push(element._id);
            });
        }
        console.log(search_result);
        // VIDEO SEARCH QUERY
        var result_2 = await Video.find({ name: { $regex: term } });
        result_2.forEach(element => {
            search_result.push(element._id);
        });
        console.log(search_result);
        // CAST SEARCH QUERY
        var result_3 = await Cast.find({ $or: [{ firstname: { $regex: term } }, { lastname: { $regex: term } }] });
        var result_4 = [];
        if (result_3.length > 0) {
            for (const resu of result_3) {
                result_4 = await Video.find({ castIds: resu._id });
                if (result_4.length > 0) {
                    result_4.forEach(element => {
                        search_result.push(element._id);
                    });
                }
            }
        }
        console.log(search_result);

        done(null, { search_result });

    } catch (error) {
        done(new Error('Nothing Found'));
    }
});
