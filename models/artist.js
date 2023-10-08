const mongoose = require('mongoose');

const Schema = mongoose.Schema;

ArtistSchema = new Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  picture: { type: String },
});

module.exports = mongoose.model('Artist', ArtistSchema);
