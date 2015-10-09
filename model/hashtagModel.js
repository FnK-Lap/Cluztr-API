var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var HashtagSchema = new Schema({
    name: { type: String }
})


module.exports = mongoose.model('Hashtag', HashtagSchema);