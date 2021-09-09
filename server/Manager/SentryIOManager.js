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