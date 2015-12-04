var mongoose = require('mongoose'),
    Group    = require('./groupModel'),
    Message  = require('./messageModel'),
    Schema   = mongoose.Schema;

var ChatSchema = new Schema({
	messages  : [{ type: Schema.Types.ObjectId, ref: 'Message' }],
	created_at: { type: Date },
	group1    : { type: Schema.Types.ObjectId, ref: 'Group' },
	group2    : { type: Schema.Types.ObjectId, ref: 'Group' },
    isPrivate : { type: Boolean }
})


module.exports = mongoose.model('Chat', ChatSchema);