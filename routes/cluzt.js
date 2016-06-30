var async    = require('async');
var Chat     = require('../model/chatModel.js');
var Cluzt    = require('../model/cluztModel.js');
var Group    = require('../model/groupModel.js');
var User     = require('../model/userModel.js');
var Picture  = require('../model/pictureModel.js');
var Interest = require('../model/interestModel.js');
var _        = require('underscore');

var cluzt = {
    getAllReceive : function (req, res) {
      var groupId = req.Cluztr.user.groupId;
      Cluzt.find({receiver: groupId, send: true}, function(err, cluzts) {
        if (err) {
          res.send(err);
        } else {
          async.each(cluzts, function(cluzt, done) {
            async.parallel({
              sender: function(cb) {
                      Group.populate(cluzt, { path: "sender" }, function(err, output) {
                        if (err) {
                          res.send(err);
                        }

                        User.populate(cluzt.sender, { path: "usersId" }, function(err, output2) {
                          async.each(cluzt.sender.usersId, function(user, cb2) {
                            async.parallel({
                              picture: function(callback) {
                                Picture.populate(user, { path: "profilePicture" }, function(err, output) {
                                  callback();
                                })
                              },
                              interest: function(callback) {
                                Interest.populate(user, { path: 'interests' }, function() {
                                  callback();
                                })
                              }
                            }, function(err) {
                              cb2();
                            });
                          }, function(err) {
                            cb();
                          })
                        })
                      })
              },
              receiver: function(cb) {
                Group.populate(cluzt, { path: 'receiver' }, function(err) {
                  if (err) { res.send(err) }

                  User.populate(cluzt.receiver, { path: "usersId" }, function() {
                    cb();
                  })
                })
              }
            }, function(err) {
              done();
            })
          }, function(err) {
            res.json({
              status:200,
              message: "Get Cluzt success",
              data: cluzts
            });
          });
        }
      })
    },
    getAllSent : function (req, res) {
      var groupId = req.Cluztr.user.groupId;
      Cluzt.find({sender: groupId, send: false}, function (err, cluzts){
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
          console.log(cluzt);
          for (i = 0; i < cluzt.acceptedUsers.length; i++) {
            console.log(user._id)
            console.log(cluzt.acceptedUsers[i])
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
            cluzt.save();
            return res.json({
              status: 201,
              message: 'chat created',
              cluzt: cluzt,
              done: true
            })
          }

          cluzt.save();
          return res.json({
            status: 201,
            message: 'clutz created',
            cluzt: cluzt
          });
        } else {
          Cluzt.findOne({ receiver: senderId, sender: receiverId }, function(err, cluztToAccept) {
            if (cluztToAccept) {
              cluzt = cluztToAccept
              cluzt.acceptedUsers.push(user._id);
              if (cluzt.acceptedUsers.length == 6){
                var chat = new Chat({
                    created_at: new Date(),
                    group1: senderId,
                    group2: receiverId,
                    isPrivate:  false
                });
                chat.save();
                cluzt.save();
                return res.json({
                  status: 201,
                  message: 'chat created',
                  cluzt: cluzt,
                  done: true
                })
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
          })
        }
      });
    }
}

module.exports = cluzt;
