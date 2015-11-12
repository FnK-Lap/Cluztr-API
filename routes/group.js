var jwt        = require('jwt-simple');
var async      = require('async');
var Group      = require('../model/groupModel.js');
var Invitation = require('../model/invitationModel.js');
var Picture    = require('../model/pictureModel.js');

var group = {
    create: function (req, res) {
        var user = req.Cluztr.user;

        if (!user.groupId) {
            var group = new Group({
            isActive: false,
            adminId: user._id,
            usersId: [user._id] 
            });

            group.save();

            user.groupId = group._id;
            user.save();

            res.json({
                status: 201,
                message: 'group created.'
            });
        } else {
            res.json({
                status: 400,
                message: 'You already have a group.'
            });
        }
    },
    get: function (req, res) {
        console.log(req.params.id);

        Group.findOne({ _id: req.params.id })
            .populate('usersId')
            .exec(function (err, group) {
                if (err) {
                    return res.json({
                        status: 400,
                        message: err
                    });
                }

                async.each(group.usersId,function(item,callback) {
                    console.log(item);
                    Picture.populate(item,{ path: "profilePicture" },function(err,output) {
                        if (err) {
                            res.json({
                                status: 400,
                                message: err
                            });
                        }

                        callback();
                    });
                }, function(err) {
                    res.json({
                        status: 200,
                        message: "Get group success",
                        data: group
                    });
                });
            }
        );
    },
    invite: function(req, res){
        var invitation = new Invitation({
            created_at: new Date(),
            groupId:    req.Cluztr.user.groupId,
            userId:     req.Cluztr.user._id,
            email:      req.params.email
        });

        invitation.save();
    },
    join: function(req, res){
        Group.findOneAndUpdate({ _id: req.params.groupId}, { $push:{ usersId: req.Cluztr.user._id }}, {}, function(err, group){
            if (err)
              res.json({ 
                status:400,
                message: err
              })

            User.findOne({ _id: req.Cluztr.user._id }, function (err, user){
              user.groupId = req.params.groupId;
              user.save();
            });

            res.json({
                status: 200,
                message: "Join group success",
                data: group
            });
        });
    }
}

module.exports = group;