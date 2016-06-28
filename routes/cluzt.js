var async    = require('async');
var Chat     = require('../model/chatModel.js');
var Cluzt    = require('../model/cluztModel.js');
var User     = require('../model/userModel.js');
var _        = require('underscore');

// var cluzt = {
//     getAllReceive : function (req, res) {
//       var groupId = req.params.id;
//       Cluzt.find({receiver.id == groupId && send == true) {
//         if (err) {
//           res.send(err)
//         } else {
//           async.each(cluzts.sender, function(item, cb) {
//             Group.populate(item, { path: "sender" }, function(err, output) {
//               if (err) {
//                 res.json({
//                   status:400,
//                   message: err
//                 });
//               }
//               cb();
//             });
//           }, function(err) {
//             res.json({
//               status:200,
//               message: "Get Cluzt success",
//               data: cluzts
//             });
//           }
//         }
//       });
//     }
// }

module.exports = cluzt;
