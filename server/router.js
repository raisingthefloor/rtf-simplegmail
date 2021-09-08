const express = require('express');
const router = express.Router();
const app = require('./server');

//require('./routes/api/test')(router);
require('./Modules/GoogleApi/routes')(router);

//registering the routes
app.use('/api', router);

module.exports = router;