const UserHistory = require('../models/userHistory');

const logUserHistory = async (req, res, next) => {
	try {
		console.log(req);
		const userId = req.query.userId;
		const videoId = req.params.id;

		const logUserHistory = new UserHistory({
			userId: userId,
			videoId: videoId,
		});

		await logUserHistory.save();
		next();
	} catch (err) {
		console.log('Error in logging History. Error: ' + err);
	}
};

module.exports = logUserHistory;
