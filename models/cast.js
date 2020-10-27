const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const config = require('../config');

const CastSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
});

const Cast = mongoose.model('Cast', CastSchema);

module.exports = Cast;
