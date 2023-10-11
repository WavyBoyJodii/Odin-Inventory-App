const mongoose = require('mongoose');

const Schema = mongoose.Schema;

ArtistSchema = new Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  picture: { type: String },
});

ArtistSchema.virtual('url').get(function () {
  return `/artist/${this._id}`;
});

module.exports = mongoose.model('Artist', ArtistSchema);
