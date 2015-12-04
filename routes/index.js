var express = require('express');
var router  = express.Router();
 
var auth    = require('./auth.js');
var group   = require('./group.js');
var chat    = require('./chat.js');
 
/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);

//////////////
//   DEBUG  //
//////////////
router.get('/admin/token/:email', auth.debugToken);

// Group
router.post('/api/v1/groups', group.create);
router.get('/api/v1/group/:id', group.get);
router.post('/api/v1/group/:id/invite', group.invite);
router.post('/api/v1/group/:id/join', group.join);

// Chat
router.get('/api/v1/group/:id/chats', chat.getAll);

// User
router.get('/api/v1/user/me/invitations', group.getInvitations);


module.exports = router;