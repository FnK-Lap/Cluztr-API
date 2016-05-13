var async    = require('async');
var Chat     = require('../model/chatModel.js');
var User     = require('../model/userModel.js');
var Message     = require('../model/messageModel.js');
var Picture  = require('../model/pictureModel.js');
var _        = require('underscore');


var chat = {
    getAll: function (req, res) {
        var groupId = req.params.id;

        Chat.find({ $or: [{group1: [groupId]}, {group2: [groupId]}] })
            .sort({ isPrivate: -1 }) // Own group chat before
            .populate('group1 group2')
            .populate({ // Get last message for preview
                path: "messages",
                options: {
                    limit: 1, 
                    sort: {created_at: -1}
                },
            })
            .lean() // Get JSObject not Mongoose document
            .exec(function (err, chats) {
                var chatsFormatted = [];
                // Format result for a better comprehension
                async.each(chats, function(item, callback) {
                    if (item.isPrivate && item.group1._id == groupId) {
                        item.ownGroup = item.group1; // Own group chat
                    } else if (item.group1 && item.group1._id == groupId) {
                        item.ownGroup   = item.group1; // Group1 is our group
                        item.otherGroup = item.group2;
                    } else {
                        item.ownGroup   = item.group2; // Group2 is our group
                        item.otherGroup = item.group1;
                    }
                    
                    delete item.group1;
                    delete item.group2;

                    // Populate profile picture for other group
                    if (item.otherGroup) {
                        User.populate(item.otherGroup, { path: "usersId" }, function(err, output) {
                            if (err) {
                                callback(err);
                            };

                            async.each(output.usersId, function(val, done) {
                                Picture.populate(val,{ path: "profilePicture" },function(err,output) {
                                    done(err);
                                });
                            }, function(err) {
                                chatsFormatted.push(item);
                                callback(err);
                            });
                        })
                    } else {
                        // Populate profile picture for own group
                        User.populate(item.ownGroup, { path: "usersId" }, function(err, output) {
                            if (err) {
                                callback(err);
                            };

                            async.each(output.usersId, function(val, done) {
                                Picture.populate(val,{ path: "profilePicture" },function(err,output) {
                                    done(err);
                                });
                            }, function(err) {
                                chatsFormatted.push(item);
                                callback(err);
                            });
                        })
                    }

                }, function(err) {
                    if (err) {
                        res.json({
                            status: 400,
                            message: err
                        });
                    };
                    res.json({
                        status: 200,
                        data: chatsFormatted,
                        message: "Chats finds"
                    });
                })
            })
    },
    getChat: function(req, res) {
        var chatId = req.params.id;
        Chat.findOne({_id: chatId})
        .populate("group1 group2")
        .exec(function (err, chat) {
            if (err) {
                res.json({
                    status: 400,
                    message: err
                });  
            } else {
                if (chat) {
                    var groupUsers = [];
                    if (chat.group2) {
                        groupUsers = chat.group1.usersId.concat(chat.group2.usersId);
                    } else {
                        groupUsers = chat.group1.usersId
                    }
                    if (_.findWhere(groupUsers, req.Cluztr.user._id)) {
                        Message.populate(chat,{ path: "messages" },function (err,output) {
                            if (err) {
                                res.json({
                                    status: 400,
                                    message: err
                                });
                            }
                            console.log("Test get messages");
                            console.log(output);
                            async.each(output.messages,function(item,callback) {
                                User.populate(item,{ path: "user" },function (err,results) {
                                    if (err) {
                                        res.json({
                                            status: 400,
                                            message: err
                                        });
                                    }

                                    Picture.populate(results.user, { path: "profilePicture" }, function (err) {
                                        if (err) {
                                            res.json({
                                                status: 400,
                                                message: err
                                            });
                                        }
                                        callback();
                                    })
                                });
                            }, function(err) {
                                console.log(chat);
                                res.json({
                                    status: 200,
                                    message: "Get messages success",
                                    data: chat
                                });
                            });
                        });
                    } else {
                        res.json({
                            status: 400,
                            message: "You can't access to this private chat"
                        });
                    }
                } else {
                    res.json({
                        status: 400,
                        message: "That Chat doesn't exist"
                    }); 
                }
            }
        });
    },
    newMessage: function(chatId, userId, message, callback) {
        console.log("Nes message "+message);
        var newMessage = new Message({
            chat: chatId,
            message: message,
            user: userId,
            created_at: new Date(),
        })

        newMessage.save();

        var chat = Chat.findOne({_id: chatId}, function(err, chat) {
            chat.messages.push(newMessage);
            chat.save();

            callback(newMessage);
        });

    }
}

module.exports = chat;