var mongoose = require('mongoose'),
    User     = require('./userModel'),
    Schema   = mongoose.Schema;

var ChatSchema = new Schema({
	message: { type: String },
	date   : { type: Date },
	group1 : { type: Schema.Types.ObjectId, ref: 'Group' },
	group2 : { type: Schema.Types.ObjectId, ref: 'Group' },
})


module.exports = mongoose.model('Chat', ChatSchema);