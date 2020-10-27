const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const config = require('../config');

const GenreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
});

const Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;
