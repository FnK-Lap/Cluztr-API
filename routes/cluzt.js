var async    = require('async');
var Chat     = require('../model/chatModel.js');
var Cluzt    = require('../model/cluztModel.js');
var User     = require('../model/userModel.js');
var _        = require('underscore');

// var cluzt = {
//     getAllReceive : function (req, res) {
//       var groupId = req.params.id;
//       Cluzt.find({receiver.id == groupId && send == true, function(err, cluzts) {
//         if (err) {
//           res.send(err)
//         } else {
//
//           res.json({
//             status: 200,
//             data: cluzts,
//             message: "Cluzts finds"
//           });
//         }
//       });
//     },
// }
//
// module.exports = cluzt;
