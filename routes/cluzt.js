var async    = require('async');
var Chat     = require('../model/chatModel.js');
var Cluzt    = require('../model/cluztModel.js');
var User     = require('../model/userModel.js');
var _        = require('underscore');

var cluzt = {
    getAllReceive : function (req, res) {
      var groupId = req.params.id;
      Cluzt.find({receiver: groupId, send: true}, function (err, cluzts){
        if (err) {
          res.send(err)
        } else {
          async.each(cluzts, function(item, cb) {
            Group.populate(item, { path: "sender" }, function(err, output) {
              if (err) {
                res.json({
                  status:400,
                  message: err
                });
              }
              cb();
            });
          }, function(err) {
            res.json({
              status:200,
              message: "Get Cluzt success",
              data: cluzts
            });
          }
        }
      });
    }
    // setCluzt : function (req, res) {
    //   var user = req.Cluztr.user;
    //   var senderId = req.params.senderId;
    //   var receiverId = req.params.receiverId;
    //
    //   Cluzt.find
    //   var cluzt = new Cluzt({
    //     sender: senderId,
    //     receiver: receiverId,
    //     acceptedUsers: [user],
    //     send: false
    //   });
    //
    //   cluzt.save();
    //
    //   res.json({
    //     status: 201,
    //     message: 'clutz created',
    //     cluzt: cluzt
    //   });
    // }
}

module.exports = cluzt;
