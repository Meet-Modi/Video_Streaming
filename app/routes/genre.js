const express = require('express')
const Genre = require('../models/genre')

const router = express.Router();

router.post('/', async (req, res) => {

    const genre = new Genre(req.body)
    try {
        await genre.save()
        res.status(201).send({ genre })
    } catch (error) {
        res.status(400).send()
    }
})


module.exports = router