var jwt        = require('jwt-simple');
var async      = require('async');
var Group      = require('../model/groupModel.js');
var Invitation = require('../model/invitationModel.js');
var Picture    = require('../model/pictureModel.js');
var User       = require('../model/userModel.js');

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
    invite: function(req, res) {
        // Verifier si une invitation est deja presente
        if (req.body.email) {
            var invitation = new Invitation({
                created_at: new Date(),
                groupId:    req.Cluztr.user.groupId,
                userId:     req.Cluztr.user._id,
                email:      req.body.email
            });

            invitation.save();
            
            res.json({
                status: 201,
                message: "Invite Success"
            })
        } else {
            res.json({
                status: 400,
                message: "Invite Fail"
            })
        }
    },
    join: function(req, res) {
        // Verifier si une invitation correspond
        // Verifier que le mec n'a pas de groupe
        // Verifier que le groupe n'est pas deja complet
        // Virer invitation
        Group.findOneAndUpdate({ _id: req.params.id}, { $push:{ usersId: req.Cluztr.user._id }}, {}, function(err, group){
            if (err)
              res.json({ 
                status:400,
                message: err
              })

            User.findOne({ _id: req.Cluztr.user._id }, function (err, user){
              user.groupId = req.params.id;
              user.save();
            });

            res.json({
                status: 200,
                message: "Join group success",
                data: group
            });
        });
    },
    getInvitations: function(req, res) {
        var user = req.Cluztr.user;

        Invitation.find({ email: user.email }, function(err, invitations) {
            if (err) {
                res.json({
                    status: 400,
                    message: err
                });
            }

            res.json({
                status: 200,
                data: invitations
            })
        })
    }
}

module.exports = group;