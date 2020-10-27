const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = express.Router();

router.get('/:term', async (req, res) => {
    const term = req.params.term;
    try {

        res.status(201).send({ term });

    } catch (error) {
        res.status(400).send();
    }
})

module.exports = router