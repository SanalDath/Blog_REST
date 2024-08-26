const mongoose = require('mongoose');
const { connectionUrl } = require('../config/keys');
 
const connectMongoDb = async () => {
    try {
        await mongoose.connect(connectionUrl);
        console.log('The connection to database is successful');
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = connectMongoDb;
