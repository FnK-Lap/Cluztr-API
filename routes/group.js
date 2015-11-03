var jwt     = require('jwt-simple');
var Group   = require('../model/groupModel.js');

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
    }
}

module.exports = group;