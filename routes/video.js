const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/video/:id', async (req, res) => {
	const userId = req.params.userId;
	const videoId = req.params.id;

	try {
		await userHistory.logUserHistory(userId, videoId);
	} catch (err) {
		console.log('Error in logging user history. Error: ' + err);
	}

	try {
		// fetch video and show
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
