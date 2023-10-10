const mongoose = require('mongoose');

const Schema = mongoose.Schema;

GenreSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 50 },
});

GenreSchema.virtual('url').get(function () {
  return `/genre/${this._id}`;
});

module.exports = mongoose.model('Genre', GenreSchema);
