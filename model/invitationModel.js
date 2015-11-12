var mongoose = require('mongoose'),
    User     = require('./userModel'),
    Group    = require('./groupModel'),
    Schema   = mongoose.Schema;

var InvitationSchema = new Schema({
    created_at   : { type: Date },
    groupId : { type: Schema.Types.ObjectId, ref: 'Group' },
    userId : { type: Schema.Types.ObjectId, ref: 'User' },
    email : { type: String }
})


module.exports = mongoose.model('Invitation', InvitationSchema);