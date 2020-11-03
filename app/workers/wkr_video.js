const Video = require('../models/video')
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


queue.process(CONST.WKR_FETCH_VIDEO, async (job, done) => {
    const videoId = job.data.videoId;
    console.log(videoId);
    try {
        // fetch video and show
        const video = await Video.findById(videoId);
        console.log(video);
        if (!video) {
            done(new Error('Invalid Credentials'));
        }
        var i = 1;
        for (i = 1; i < 11; i++) {
            job.progress(i, 10, { nextSlide: i == 10 ? 'itsdone' : i + 1 });
        }
        try {
            const fileName = video.fileName;
            const path = 'assets/' + fileName;
            const stat = fs.statSync(path);
            const fileSize = stat.size;
            const range = req.headers.range;
            if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

                const chunksize = end - start + 1;
                const file = fs.createReadStream(path, { start, end });
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                };
                res.writeHead(206, head);
                file.pipe(res);
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                };
                res.writeHead(200, head);
                fs.createReadStream(path).pipe(res);
            }
        } catch (err) {
            console.log('Error in fetching video file. Error: ' + err);
        }
        done();
        /*        try {
                    const fileName = video.fileName;
                    const path = 'assets/' + fileName;
                    const stat = fs.statSync(path);
                    const fileSize = stat.size;
                    const range = req.headers.range;
                    if (range) {
                        const parts = range.replace(/bytes=/, '').split('-');
                        const start = parseInt(parts[0], 10);
                        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        
                        const chunksize = end - start + 1;
                        const file = fs.createReadStream(path, { start, end });
                        const head = {
                            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                            'Accept-Ranges': 'bytes',
                            'Content-Length': chunksize,
                            'Content-Type': 'video/mp4',
                        };
                        res.writeHead(206, head);
                        file.pipe(res);
                    } else {
                        const head = {
                            'Content-Length': fileSize,
                            'Content-Type': 'video/mp4',
                        };
                        res.writeHead(200, head);
                        fs.createReadStream(path).pipe(res);
                    }
                } catch (err) {
                    console.log('Error in fetching video file. Error: ' + err);
                }*/
        // res.status(200).send(video);
    } catch (err) {
        console.log('Error in fetching video. Error: ' + err);
    }
});
/*
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
*/