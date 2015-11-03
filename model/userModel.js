var mongoose = require('mongoose'),
    Picture  = require('./pictureModel'),
    Interest = require('./interestModel'),
    Group    = require('./groupModel'),
    Schema   = mongoose.Schema;

var UserSchema = new Schema({
    firstname     : { type: String, match: /^[a-zA-Z0-9-_]+$/ },
    lastname      : { type: String, match: /^[a-zA-Z0-9-_]+$/ },
    age           : { type: Number, min: 18 },
    email         : { type: String, index: { unique: true } },
    gender        : { type: String, match: /^[male]||[female]$/ },
    isActive      : { type: Boolean },
    createdAt     : { type: Date },
    updatedAt     : { type: Date },
    interests     : [{ type: Schema.Types.ObjectId, ref: 'Interest'}],
    profilePicture: { type: Schema.Types.ObjectId, ref: 'Picture' },
    pictures      : [{ type: Schema.Types.ObjectId, ref: 'Picture'}],
    groupId       : { type: Schema.Types.ObjectId, ref: 'Group' }
})


module.exports = mongoose.model('User', UserSchema);