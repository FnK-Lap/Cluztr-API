var mongoose = require('mongoose'),
    User = require('./userModel'),
    Group = require('./groupModel'),
    Schema = mongoose.Schema;

var GroupRequestSchema = new Schema({
  targetGroupId: { type: Schema.Types.ObjectId, ref: 'Group' },
  senderGroupId: { type: Schema.Types.ObjectId, ref: 'Group' },
  targetsId: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  sendersId: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  isRequest: { type: Boolean },
})


module.exports = mongoose.model('GroupRequest', GroupRequestSchema);