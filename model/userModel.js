var mongoose = require('mongoose'),
    Picture  = require('./pictureModel'),
    Interest = require('./interestModel'),
    Schema   = mongoose.Schema;

var UserSchema = new Schema({
    firstname     : { type: String, match: /^[a-zA-Z0-9-_]+$/ },
    lastname      : { type: String, match: /^[a-zA-Z0-9-_]+$/ },
    age           : { type: Number, min: 18 },
    email         : { type: String, index: { unique: true } },
    isActive      : { type: Boolean },
    createdAt     : { type: Date },
    updatedAt     : { type: Date },
    interests     : [{ type: Schema.Types.ObjectId, ref: 'Interest'}],
    profilePicture: { type: Schema.Types.ObjectId, ref: 'Picture' },
    pictures      : [{ type: Schema.Types.ObjectId, ref: 'Picture'}]
})


module.exports = mongoose.model('User', UserSchema);