var mongoose = require('mongoose'),
    User     = require('./userModel'),
    Schema   = mongoose.Schema;

var NotificationSchema = new Schema({
    type       : { type: String },
    message    : { type: String },
    createdAt  : { type: Date },
    receiver_id: { type: Schema.Types.ObjectId, ref: 'User' }
})


module.exports = mongoose.model('Notification', NotificationSchema);