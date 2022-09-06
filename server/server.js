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
const tls = require("tls");
const fs = require("fs");

//Set port number for application
const port = process.env.port || 5000;

//Establish connection with Mongodb
mongoConnHandler.connect();

startNonSSLServer()

function startNonSSLServer() {
    let server = require('http').createServer(app);
    server.listen(port, function () {
        console.log('NON SSL server listening on port ' + server.address().port);
    });
}

function startSSLServer() {
    let sslDomain = process.env.SSL_DOMAIN
    const options = {
        SNICallback: function (domain, cb) {
            try {
                console.log('🌐  SSL Domain Requested: ' + domain);
                const securetls = tls.createSecureContext({
                    key: fs.readFileSync(`/etc/letsencrypt/live/${sslDomain}/privkey.pem`),
                    cert: fs.readFileSync(`/etc/letsencrypt/live/${sslDomain}/cert.pem`),
                    ca: fs.readFileSync(`/etc/letsencrypt/live/${sslDomain}/chain.pem`)
                })
                if (securetls) {
                    if (cb) {
                        cb(null, securetls);
                    } else {
                        return securetls;
                    }
                } else {
                    console.log('No keys/certificates for domain requested ' + domain);
                }
            } catch (e) {
                console.error(e)
            }

        },
        key: fs.readFileSync(`/etc/letsencrypt/live/${sslDomain}/privkey.pem`),
        cert: fs.readFileSync(`/etc/letsencrypt/live/${sslDomain}/cert.pem`),
        ca: fs.readFileSync(`/etc/letsencrypt/live/${sslDomain}/chain.pem`)

    }
    let server = require('https').createServer(options, app);
    server.listen(port, function () {
        console.log('SSL server listening on port ' + server.address().port);
    });
}
