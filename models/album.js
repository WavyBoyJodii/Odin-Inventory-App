const { DateTime } = require('luxon');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
  release_date: { type: Date, default: Date.now },
  genre: { type: Schema.Types.ObjectId, ref: 'Genre', required: true },
  art: { type: String },
});

AlbumSchema.virtual('url').get(function () {
  return `/album/${this._id}`;
});
AlbumSchema.virtual('release_date_formatted').get(function () {
  return DateTime.fromJSDate(this.release_date).toLocaleString(
    DateTime.DATE_MED
  );
});

module.exports = mongoose.model('Album', AlbumSchema);
