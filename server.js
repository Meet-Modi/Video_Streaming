const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

// Router Files
const videoRouter = require('./routes/video');
const router = require('./routes');

const env = process.env.NODE_ENV || 'DEVELOPMENT'

const app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/api', router);
app.use('/api', videoRouter);


const port = process.env.PORT || 3000
app.listen(port, function () {
    console.log('Server is running on port 3000')
})