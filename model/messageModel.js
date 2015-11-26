var mongoose = require('mongoose'),
    User     = require('./userModel'),
    Chat     = require('./chatModel'),
    Schema   = mongoose.Schema;

var MessageSchema = new Schema({
    message    : { type: String },
    created_at : { type: Date },
    user       : { type: Schema.Types.ObjectId, ref: 'User' },
    chat       : { type: Schema.Types.ObjectId, ref: 'Chat'}
})


module.exports = mongoose.model('Message', MessageSchema);