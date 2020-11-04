const express = require('express');
const auth = require('../middleware/auth');
const Genre = require('../models/genre');
const UserHistory = require('../models/userHistory');
const Video = require('../models/video');

const router = express.Router();

router.get('/all', auth, async (req, res) => {
	try {
		const userId = req.user._id;
		const getAllUserHistory = await UserHistory.find({ userId: userId });
		res.status(200).send(getAllUserHistory);
	} catch (error) {
		res.status(400).send();
	}
});

router.get('/genre', auth, async (req, res) => {
	try {
		const userId = req.user._id;
		const getAllUserHistory = await UserHistory.find({ userId: userId });
		// console.log(getAllUserHistory);
		const genreIds = [];
		for (const video of getAllUserHistory) {
			const currentVideo = await Video.findById(video.videoId);
			genreIds.push(currentVideo.genreIds);
		}
		const genreNames = [];
		for (const genre of genreIds) {
			const currentGenre = await Genre.findById(genre);
			console.log(currentGenre);
			genreNames.push(currentGenre.name);
		}

		const userGenreHistory = [];
		let sotedGenreNames = genreNames.sort();

		if (sotedGenreNames.length === 0) {
			res.status(200).send({});
		} else if (sotedGenreNames.length === 1) {
			res.status(200).send({
				genreName: sotedGenreNames[0],
				count: 1,
			});
		} else {
			let currentCount = 1;
			for (let i = 1; i < sotedGenreNames.length; i++) {
				if (i === sotedGenreNames.length - 1) {
					if (sotedGenreNames[i - 1] === sotedGenreNames[i]) {
						currentCount++;
						userGenreHistory.push({
							count: currentCount,
							genreName: sotedGenreNames[i],
						});
					} else {
						userGenreHistory.push({ count: 1, genreName: sotedGenreNames[i] });
					}
				} else if (
					i < sotedGenreNames.length - 1 &&
					sotedGenreNames[i - 1] !== sotedGenreNames[i]
				) {
					userGenreHistory.push({
						count: currentCount,
						genreName: sotedGenreNames[i - 1],
					});
					currentCount = 1;
				} else {
					currentCount++;
				}
			}
			res.status(200).send(userGenreHistory);
		}
	} catch (error) {
		console.log('Error in user genre history. Error: ' + error);
		res.status(400).send();
	}
});

module.exports = router;
