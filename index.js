let express = require('./express/bin/www')
let commerce = require('./commerce/admin');

module.exports.module = commerce;
module.exports.startServer = express.start; 
module.exports.app = express.app; 