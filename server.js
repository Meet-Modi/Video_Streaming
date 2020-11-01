const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
const mongoose = require('mongoose').set('debug', true);
const path = require('path');
const CONFIG = require('./app/helpers/config.js');
const env = process.env.NODE_ENV || 'DEVELOPMENT';


const router = require('./app/routes');
const videoRouter = require('./app/routes/video');
const UserRouter = require('./app/routes/user');
const SearchRouter = require('./app/routes/search');
const GenreRouter = require('./app/routes/genre');
const CastRouter = require('./app/routes/cast');


mongoose.connect(env === 'DEVELOPMENT' ? CONFIG.DB_URI_DEV : CONFIG.DB_URI, {
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

app.set('port', process.env.SERVER_PORT || 3000);

app.get('/ping', function (req, res) {
	console.log("pong");
	res.send({ message: 'PONG' });
});

app.use('/api', router);
app.use('/api', videoRouter);
app.use('/api/users', UserRouter);
app.use('/api/search', SearchRouter);
app.use('/api/genre', GenreRouter);
app.use('/api/cast', CastRouter);

var server = app.listen(app.get('port'), function () {
	var port = server.address().port;
	console.log('Application started at port : ' + port);
});









// Router Files
/*
const videoRouter = require('./routes/video');
const router = require('./routes');
const UserRouter = require('./routes/user');
const SearchRouter = require('./routes/search');
const GenreRouter = require('./routes/genre');
const CastRouter = require('./routes/cast');
*/

/*app.use('/api', router);
app.use('/api', videoRouter);
app.use('/api/users', UserRouter);
app.use('/api/search', SearchRouter);
app.use('/api/genre', GenreRouter);
app.use('/api/cast', CastRouter);
*/

