var mongoose = require('mongoose'),
    User     = require('./userModel'),
    Group    = require('./groupModel'),
    Schema   = mongoose.Schema;

var CluztSchema = new Schema({
    sender : { type: Schema.Types.ObjectId, ref: 'Group'},
    receiver : { type: Schema.Types.ObjectId, ref: 'Group'},
    acceptedUsers : [{ type: Schema.Types.ObjectId, ref: 'User'}],
    send : { type: Boolean }
})

module.exports = mongoose.model('Cluzt', CluztSchema);
