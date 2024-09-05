const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectMongoDb = require('./init/mongoDb');
const {authRoute, categoryRoute } = require('./routes');
const morgan = require('morgan');
const { errorMiddleware } = require('./middleware');
const undefRoute = require('./controller/undefRoute');

dotenv.config(); // configure dotenv

//console.log('Environment Variables:', process.env.PORT, process.env.CONNECTION_URL);
const app = express(); // initialize Express app

connectMongoDb(); // connect to MongoDB

//Initialising third party middleware
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use(morgan('dev'));

//configuring routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoute);

//undefined route
app.use('/*', undefRoute);

//error handling
app.use(errorMiddleware);

module.exports = app;
