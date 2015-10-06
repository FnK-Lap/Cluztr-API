var mongoose = require('mongoose'),
    User = require('./userModel'),
    Schema = mongoose.Schema;

var pictureSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  url: { type: String },
  mimeType: { type: String },
  createdAt: { type: Date }
})


module.exports = mongoose.model('Picture', PictureSchema);