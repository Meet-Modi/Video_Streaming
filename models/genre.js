const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const config = require('../config');


{
    _id: objectId,
        name: string,
            description: string
}
const GenreSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    videoId: {
        type: String,
        required: true,
    },
});

const UserHistory = mongoose.model('UserHistory', UserHistorySchema);

module.exports = UserHistory;
