const express = require('express')
const Genre = require('../models/genre')
const auth = require('../middleware/auth')

const router = express.Router();

router.get('/:term', async (req, res) => {
    const term = req.params.term;
    try {
        const result = await Genre.findOne({ "name": term });
        res.status(201).send({ result });
    } catch (error) {
        res.status(400).send();
    }
})

module.exports = router