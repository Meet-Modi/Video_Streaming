const express = require('express')
const Cast = require('../models/cast')

const router = express.Router();

router.post('/', async (req, res) => {

    const cast = new Cast(req.body)
    try {
        await cast.save()
        res.status(201).send({ cast })
    } catch (error) {
        res.status(400).send()
    }
})


module.exports = router