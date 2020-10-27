// data flow

import { use } from '../routes';

// 1. user clicks on a video
// 2. this will call a /api/video/{video_id}
// 3. we will create a middleware for this

// middleware flow

const User = require('../models/user');
const Video = require('../models/video');
const UserHistory = require('../models/userHistory');

export class UserHistory {
	constructor(userId, videoId) {
		this.userId = userId;
		this.videId = videoId;
	}

	async logUserHistory() {
		try {
			const user = User.findById(this.userId);
			const video = Video.findById(this.videoId);

			const logUserHistory = new UserHistory({
				userId: user,
				videoId: video,
			});
			await logUserHistory.save();
		} catch (err) {
			console.log('Error in logging History. Error: ' + err);
		}
	}
}
