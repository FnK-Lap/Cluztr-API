var mongoose = require('mongoose'),
    User = require('./userModel'),
    Hashtag = require('./hashtagModel'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
  isActive: { type: Boolean },
  description: { type: String },
  adminId: { type: Schema.Types.ObjectId, ref: 'User' },
  usersId: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  hashtags: [{ type: Schema.Types.ObjectId, ref: 'Hashtag'}],
})


module.exports = mongoose.model('Group', GroupSchema);