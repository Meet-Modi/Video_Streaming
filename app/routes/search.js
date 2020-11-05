const express = require('express')
const Genre = require('../models/genre')
const Video = require('../models/video');
const Cast = require('../models/cast');
const auth = require('../middleware/auth')

const router = express.Router();

const CONFIG = require('../helpers/config.js');
const CONST = require('../helpers/constant.js');

const kue = require('kue');
const queue = kue.createQueue({ redis: CONFIG.database.redis });
queue.setMaxListeners(100000);


router.get('/term/:term', async (req, res) => {
    const term = req.params.term;
    const time = parseInt(new Date().getTime() / 1000);
    const SearchTermJob = queue.create(CONST.WKR_SEARCH_TERM, {
        timestamp: time,
        term: term,
    })
        .removeOnComplete(true)
        .save((err) => {
            if (err) { console.log(err); }
            queue.client.expire(queue.client.getKey('job:' + SearchTermJob.id), 3600);
        });

    SearchTermJob.on('complete', (result) => {
        res.status(201).send(result)
        console.log('[ST]', "Search Term Finished");
    });
    SearchTermJob.on('error', () => {
        console.log('[ST]', "Search Term Failed");
        res.status(401).send({ message: 'Oops! nothing like this exists' })
    });

})

router.get('/explore', async (req, res) => {
    const time = parseInt(new Date().getTime() / 1000);
    const ExploreJob = queue.create(CONST.WKR_EXPLORE, {
        timestamp: time
    })
        .removeOnComplete(true)
        .save((err) => {
            if (err) { console.log(err); }
            queue.client.expire(queue.client.getKey('job:' + ExploreJob.id), 3600);
        });

    ExploreJob.on('complete', (result) => {
        res.status(201).send(result)
        console.log('[ST]', "Explore Finished");
    });
    ExploreJob.on('error', () => {
        console.log('[ST]', "Explore Failed");
        res.status(401).send({ message: 'Oops! nothing like this exists' })
    });

})


module.exports = router