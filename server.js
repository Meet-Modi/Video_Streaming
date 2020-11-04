const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose').set('debug', true);
const kue = require('kue');
const path = require('path');
const env = process.env.NODE_ENV || 'DEVELOPMENT';
require('dotenv').config();
const CONST = require('./app/helpers/constant.js');
const CONFIG = require('./app/helpers/config.js');

const queue = kue.createQueue({ redis: CONFIG.database.redis });
queue.setMaxListeners(100000);

mongoose.connect(process.env.NODE_ENV === 'DEVELOPMENT' ? CONFIG.DB_URI_DEV : CONFIG.DB_URI, {
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
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 100000, limit: '500mb' }));
app.use(bodyParser.json({ limit: '500mb' }));

// Router Files
const router = require('./app/routes');
const videoRouter = require('./app/routes/video');
const UserRouter = require('./app/routes/user');
const SearchRouter = require('./app/routes/search');
const GenreRouter = require('./app/routes/genre');
const CastRouter = require('./app/routes/cast');

app.set('port', process.env.SERVER_PORT || 8080);

app.get('/ping', function (req, res) {
	console.log("pong");
	res.send({ message: 'PONG' });
});

//app.use('/api', router);
app.use('/api', videoRouter);
app.use('/api/users', UserRouter);
app.use('/api/search', SearchRouter);
app.use('/api/genre', GenreRouter);
app.use('/api/cast', CastRouter);

var server = app.listen(app.get('port'), function () {
	var port = server.address().port;
	console.log('Application started at port : ' + port);
});
