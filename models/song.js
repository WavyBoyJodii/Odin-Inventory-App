const mongoose = require('mongoose');

const Schema = mongoose.Schema;

SongSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
  album: { type: Schema.Types.ObjectId, ref: 'Album', required: true },
  ft: [{ type: Schema.Types.ObjectId, ref: 'Artist' }],
  // for song art
  art: { type: String },
});

module.exports = mongoose.model('Song', SongSchema);
