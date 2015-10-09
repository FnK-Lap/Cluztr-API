var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var InterestSchema = new Schema({
    name: { type: String, match: /^[a-zA-Z0-9-_]+$/ }
})


module.exports = mongoose.model('Interest', InterestSchema);