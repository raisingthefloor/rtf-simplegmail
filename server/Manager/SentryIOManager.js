const Sentry =  require("@sentry/node");
const Tracing = require("@sentry/tracing");

module.exports.setup = app => {
    Sentry.init({
        dsn: "https://c7ec5a278b4e4821898dafddacc0bdb4@o464399.ingest.sentry.io/5888634",
        debug: true,
        integrations: [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({tracing: true}),
            // enable Express.js middleware tracing
            new Tracing.Integrations.Express({app}),
        ],
        tracesSampleRate: 1.0,
        environment: process.env.NODE_ENV || "local"
    });

    return Sentry
}

exports.Sentry = Sentry
exports.Tracing = Tracing  