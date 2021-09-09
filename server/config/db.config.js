/**
 Copyright 2020 Raising the Floor - International

 Licensed under the New BSD license. You may not use this file except in
 compliance with this License.

 You may obtain a copy of the License at
 https://github.com/GPII/universal/blob/master/LICENSE.txt

 The R&D leading to these results received funding from the:
 * Rehabilitation Services Administration, US Dept. of Education under
 grant H421A150006 (APCP)
 * National Institute on Disability, Independent Living, and
 Rehabilitation Research (NIDILRR)
 * Administration for Independent Living & Dept. of Education under grants
 H133E080022 (RERC-IT) and H133E130028/90RE5003-01-00 (UIITA-RERC)
 * European Union's Seventh Framework Programme (FP7/2007-2013) grant
 agreement nos. 289016 (Cloud4all) and 610510 (Prosperity4All)
 * William and Flora Hewlett Foundation
 * Ontario Ministry of Research and Innovation
 * Canadian Foundation for Innovation
 * Adobe Foundation
 * Consumer Electronics Association Foundation
 **/

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