const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express(); //init node app
dotenv.config(); //configure dotenv

app.use(bodyParser.json({ limit: '500mb' })); //bodyparser is set to parse json
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true })); //parse url encoded data


module.exports = app;