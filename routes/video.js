const express = require('express');
const fs = require('fs');
const Video = require('../models/video');
const logUserHistory = require('../middleware/userHistory');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/video/:id', auth, logUserHistory, async (req, res) => {
	const videoId = req.params.id;

	try {
		// fetch video and show
		const video = await Video.findById(videoId);
		if (!video) {
			return res.status(404).send();
		}
		try {
			const fileName = video.fileName;
			const path = 'assets/' + fileName;
			const stat = fs.statSync(path);
			const fileSize = stat.size;
			const range = req.headers.range;

			if (range) {
				const parts = range.replace(/bytes=/, '').split('-');
				const start = parseInt(parts[0], 10);
				const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

				const chunksize = end - start + 1;
				const file = fs.createReadStream(path, { start, end });
				const head = {
					'Content-Range': `bytes ${start}-${end}/${fileSize}`,
					'Accept-Ranges': 'bytes',
					'Content-Length': chunksize,
					'Content-Type': 'video/mp4',
				};

				res.writeHead(206, head);
				file.pipe(res);
			} else {
				const head = {
					'Content-Length': fileSize,
					'Content-Type': 'video/mp4',
				};
				res.writeHead(200, head);
				fs.createReadStream(path).pipe(res);
			}
		} catch (err) {
			console.log('Error in fetching video file. Error: ' + err);
		}

		// res.status(200).send(video);
	} catch (err) {
		console.log('Error in fetching video. Error: ' + err);
	}
});

router.get('/video', function (req, res) {
	const path = 'assets/sample.mp4';
	const stat = fs.statSync(path);
	const fileSize = stat.size;
	const range = req.headers.range;

	if (range) {
		const parts = range.replace(/bytes=/, '').split('-');
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

		const chunksize = end - start + 1;
		const file = fs.createReadStream(path, { start, end });
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		};

		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		};
		res.writeHead(200, head);
		fs.createReadStream(path).pipe(res);
	}
});

module.exports = router;
