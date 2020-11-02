const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const CONFIG = require('../helpers/config.js');
const CONST = require('../helpers/constant.js');

const kue = require('kue');
const queue = kue.createQueue({ redis: CONFIG.database.redis });
queue.setMaxListeners(100000);

const router = express.Router();

router.post('/', async (req, res) => {
    const user = req.body;
    const time = parseInt(new Date().getTime() / 1000);
    const fetchUserJob = queue.create(CONST.WKR_FETCH_NEW_USER, {
        timestamp: time,
        user: user,
    })
        .removeOnComplete(true)
        .save((err) => {
            if (err) { console.log(err); }
            queue.client.expire(queue.client.getKey('job:' + fetchUserJob.id), 3600);
        });

    fetchUserJob.on('complete', (result) => {
        res.status(201).send(result)
        console.log('[FST]', "Fetch and Store User Finished");
    });
    fetchUserJob.on('error', () => {
        console.log('[FST]', "Fetch and Store User Failed");
        res.status(401).send({ message: 'Error while Creating User' })
    });
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        )
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [
        'name',
        'email',
        'password',
    ]

    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    )
/*
    if (!isValidOperation) {
  */      res.status(400).send({ error: 'Invalid updates' })
    /*}

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send()
    }*/
})

router.delete('/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router