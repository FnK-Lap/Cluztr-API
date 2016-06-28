var async    = require('async');
var Chat     = require('../model/chatModel.js');
var Cluzt    = require('../model/cluztModel.js');
var Group    = require('../model/groupModel.js');
var User     = require('../model/userModel.js');
var _        = require('underscore');

var cluzt = {
    getAllReceive : function (req, res) {
      var groupId = req.Cluztr.user.groupId;
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
        )}
      });
    },
    setCluzt : function (req, res) {
      var user = req.Cluztr.user;
      var senderId = user.groupId;
      var receiverId = req.params.receiverId;

      Cluzt.findOne({receiver: receiverId, sender: senderId}, function (err, cluzt){
        if (cluzt){
          if (cluzt.acceptedUsers.indexOf(user._id)){
            res.json({
              status: 400,
              message: "You can't cluzt twice"
            });
          }
          cluzt.acceptedUsers.push(user._id);
          if (cluzt.acceptedUsers.length == 3){
            cluzt.send = true;
          } else if (cluzt.acceptedUsers.length == 6){
            new Chat({
                created_at: new Date(),
                group1: senderId,
                group2: receiverId,
                isPrivate:  false
            });
          }
        } else {
          var cluzt = new Cluzt({
            sender: senderId,
            receiver: receiverId,
            acceptedUsers: [user._id],
            send: false
          });
        }
        cluzt.save();
      });

      res.json({
        status: 201,
        message: 'clutz created',
        cluzt: cluzt
      });
    }
}

module.exports = cluzt;
