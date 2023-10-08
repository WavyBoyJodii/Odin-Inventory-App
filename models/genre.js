const mongoose = require('mongoose');

const Schema = mongoose.Schema;

GenreSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 50 },
});

module.exports = mongoose.model('Genre', GenreSchema);
