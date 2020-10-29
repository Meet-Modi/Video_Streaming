const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose').set('debug', true);
const path = require('path');
const config = require('./config.js');

// Router Files
const videoRouter = require('./routes/video');
const router = require('./routes');
const UserRouter = require('./routes/user');
const SearchRouter = require('./routes/search');
const GenreRouter = require('./routes/genre');
const CastRouter = require('./routes/cast');
const UserHistoryRouter = require('./routes/userHistory.js');

const env = process.env.NODE_ENV || 'DEVELOPMENT';

mongoose
	.connect(env === 'DEVELOPMENT' ? config.DB_URI_DEV : config.DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
		socketTimeoutMS: 3000,
		keepAlive: true,
		reconnectTries: 3000,
	})
	.then(
		function () {
			//connected successfully
			console.log('Database connection successful!');
		},
		function (err) {
			console.log(err);
		}
	);

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.use('/api', router);
app.use('/api', videoRouter);
app.use('/api/users', UserRouter);
app.use('/api/search', SearchRouter);
app.use('/api/genre', GenreRouter);
app.use('/api/cast', CastRouter);
app.use('/api/userhistory', UserHistoryRouter);

const port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Server is running on port 3000');
});
