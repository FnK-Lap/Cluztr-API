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
    getAllSent : function (req, res) {
      var groupId = req.Cluztr.user.groupId;
      Cluzt.find({sender: groupId, send: true}, function (err, cluzts){
        if (err) {
          res.send(err)
        } else {
          async.each(cluzts, function(item, cb) {
            Group.populate(item, { path: "receiver" }, function(err, output) {
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
          for (i = 0; i < cluzt.acceptedUsers.length; i++) {
            if (user._id.equals(cluzt.acceptedUsers[i])) {
              return res.json({
                status: 400,
                message: "You can't cluzt twice"
              });
            }
          }
          cluzt.acceptedUsers.push(user._id);
          if (cluzt.acceptedUsers.length == 3){
            cluzt.send = true;
            cluzt.save();
            return res.json({
              status: 201,
              message: 'clutz updated',
              cluzt: cluzt
            });
          } else if (cluzt.acceptedUsers.length == 6){
            var chat = new Chat({
                created_at: new Date(),
                group1: senderId,
                group2: receiverId,
                isPrivate:  false
            });
            chat.save();
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
        return res.json({
          status: 201,
          message: 'clutz created',
          cluzt: cluzt
        });
      });
    }
}

module.exports = cluzt;
