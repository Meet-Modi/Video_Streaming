const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const config = require('../config');

const videoSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	genreIds: [
		{
			type: String,
		},
	],
	castIds: [
		{
			type: String,
		},
	],
	tagIds: [
		{
			type: String,
		},
	],
	fileName: {
		type: String,
	},
});

const Video = mongoose.model('Videos', videoSchema);

module.exports = Video;
