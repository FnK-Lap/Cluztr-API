var jwt        = require('jwt-simple');
var async      = require('async');
var Group      = require('../model/groupModel.js');
var Chat       = require('../model/chatModel.js');
var Invitation = require('../model/invitationModel.js');
var Picture    = require('../model/pictureModel.js');
var User       = require('../model/userModel.js');

var group = {
    create: function (req, res) {
        var user = req.Cluztr.user;

        if (!user.groupId) {
            var group = new Group({
                isActive: false,
                adminId:  user._id,
                usersId:  [user._id] 
            });

            group.save();

            user.groupId = group._id;
            user.save();

            var chat = new Chat({
                created_at: new Date(),
                group1:     group._id,
                isPrivate:  true
            });

            chat.save();

            res.json({
                status: 201,
                message: 'group created.',
                user: user
            });
        } else {
            res.json({
                status: 400,
                message: 'You already have a group.'
            });
        }
    },
    get: function (req, res) {
        Group.findOne({ _id: req.params.id })
            .populate('usersId')
            .exec(function (err, group) {
                if (err) {
                    return res.json({
                        status: 400,
                        message: "That group doesn't exist"
                    });
                }

                async.each(group.usersId,function(item,callback) {
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
    getAll: function (req, res) {
        Group.find({}, function(err, groups) {
            res.json({
                status: 200,
                message: "Get all groups success",
                data: groups
            });
        })
    }
    invite: function(req, res) {
        // Check if group exist
        Group.findOne({ _id: req.params.id }, function (err, group){
            if (err) {
                return res.json({
                    status: 400,
                    message: "Ce groupe n'existe pas."
                }); 
            } else {
                // Check if user already got an invitation from this group.
                Invitation.findOne({ email: req.body.email, groupId: req.params.id }, function (err, invitation){
                    if (invitation) {
                        res.json({
                            status: 400,
                            message: "Vous avez déjà inviter cette personne à rejoindre votre groupe."
                        });
                    } else {
                        if (req.body.email) {
                            var invitation = new Invitation({
                                created_at: new Date(),
                                groupId:    req.params.id,
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
                    }
                });
            }
        });
    },
    join: function(req, res) {
        var user = req.Cluztr.user;

        if (!user.groupId) {
            Invitation.findOne({ email: user.email, groupId: req.params.id }, function(err, invitation) {
                if (err) {
                    res.json({
                        status: 400,
                        message: "No invitations found"
                    });
                }

                if (invitation) {

                    Group.findOne({ _id: req.params.id}, function(err, group) {
                        if (err) {
                            res.json({
                                status: 400,
                                message: "That group doesn't exist"
                            });
                        } else {
                            if (group.usersId.length < 3) {
                                User.findOne({ _id: req.Cluztr.user._id }, function (err, user){
                                    if (err) {
                                        res.json({
                                            status: 400,
                                            message: "User doesn't exist"
                                        });
                                    } else {
                                        user.groupId = req.params.id;
                                        user.save();
                                        group.usersId.push(req.Cluztr.user._id);
                                        if (group.usersId.length == 3) {
                                            group.isActive = true;
                                        };
                                        group.save();

                                        Invitation.remove({ _id: invitation._id }, function(err) {
                                            if (err) {
                                                res.status(400).json({
                                                    status: 400,
                                                    message: err
                                                })
                                            }

                                            res.json({
                                                status: 200,
                                                message: "Join group success",
                                                data: group,
                                                user: user
                                            });
                                        })
                                    }
                                });
                            } else {
                                res.json({
                                    status: 400,
                                    message: "That group is full"
                                });
                            }
                        }
                    });
                }
            })
        } else {
            res.status(400).json({
                status: 400,
                message: "You already have a group"
            })
        }
    },
    getInvitations: function(req, res) {
        var user = req.Cluztr.user;
        Invitation.find({ email: user.email })
            .populate('groupId')
            .populate('userId')
            .exec(function(err, invitations) {
                if (err) {
                    res.json({
                        status: 400,
                        message: "No invitations found"
                    });
                }

                async.each(invitations, function(item, callback) {
                    Picture.populate(item.userId,{ path: "profilePicture" },function(err,output) {
                        if (err) {
                            res.json({
                                status: 400,
                                message: err
                            });
                        }
                    });
                    User.populate(item.groupId,{ path: "usersId" }, function(err, output) {
                        if (err) {
                            res.json({
                                status: 400,
                                message: err
                            });
                        };
                        async.each(output.usersId, function(val, done) {
                            Picture.populate(val,{ path: "profilePicture" },function(err,output) {
                                if (err) {
                                    res.json({
                                        status: 400,
                                        message: err
                                    });
                                }
                                done();
                            });
                        }, function(err) {
                            if (err) {
                                res.json({
                                    status: 400,
                                    message: err
                                });
                            }

                            callback();
                        });
                    });
                }, function(err) {
                    if (err) {
                        res.json({
                            status: 400,
                            message: err
                        });
                    }

                    res.json({
                        status: 200,
                        message: "Get Invitations success",
                        data: invitations
                    }) 
                });

                
            }
        )
    }
}

module.exports = group;