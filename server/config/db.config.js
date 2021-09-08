const mongoose = require('mongoose');
const logger = require('../logger');
require('dotenv').config()

//CONNECTION URI
const mongoURI = `mongodb://${process.env.HOST}:${process.env.MONGODB_PORT}/${process.env.DB_NAME}`;
//Connection options
let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
//calling this methods connects to mongo database
const connect = () => {
    mongoose.connect(mongoURI, options)
        .then(() => {
            logger.info("✅ ✅ ✅ --- Mongo DB connected --- ✅ ✅ ✅");
        })
        .catch(e => logger.error(`Error while connecting : ${e}`));
}
//calling this methods closes the opening mongodb connection
const disconnect = () => {
    if (!mongoose.connection) {
        return;
    }
    mongoose.disconnect();
    mongoose.once("close", async () => {
        logger.info("Disconnected  to database");
    });
}

module.exports = {
    connect
}