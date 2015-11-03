var express = require('express');
var router  = express.Router();
 
var auth    = require('./auth.js');
var group   = require('./group.js');
 
/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);
router.post('/api/v1/groups', group.create);


module.exports = router;