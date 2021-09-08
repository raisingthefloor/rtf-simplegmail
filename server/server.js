const express = require('express');
const SentryIO = require('./Manager/SentryIOManager');
const logger = require('./logger');
const mongoConnHandler = require('./config/db.config');
require('dotenv').config()

//Instantiate Express app
const app = module.exports = express();
app.use(express.json()); //Used to parse JSON bodies
//app.use(express.urlencoded()); //Parse URL-encoded bodies

//Sentry configurations
const Sentry = SentryIO.setup(app);
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
app.use(Sentry.Handlers.tracingHandler());

//Import the router
require('./router');

//Set port number for application
const port = process.env.port || 5000;

//Establish connection with Mongodb
mongoConnHandler.connect();

//Start the app server
app.listen(port, () => {
    logger.info(`Server listening on port : ${port}`);
});