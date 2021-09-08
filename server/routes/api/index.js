let express = require('express');
let app = require('./server');
let router = express.Router();
require('../../Modules/GoogleApi/routes')(router);
app.use(router)
module.exports = router;