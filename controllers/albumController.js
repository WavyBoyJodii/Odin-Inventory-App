const Album = require('../models/album');
const Song = require('../models/song');
const Artist = require('../models/artist');
const Genre = require('../models/genre');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// Display all albums
exports.album_list = asyncHandler(async (req, res, next) => {
  const allAlbums = await Album.find()
    .sort({ title: 1 })
    .populate('artist')
    .exec();
  res.render('album_list', {
    title: 'Albums',
    album_list: allAlbums,
  });
});

// Display specific album based on ID
exports.album_detail = asyncHandler(async (req, res, next) => {
  // Get details of album and find songs associated with album
  const [album, songs] = await Promise.all([
    Album.findById(req.params.id).populate('artist').populate('genre').exec(),
    Song.find({ album: req.params.id })
      .populate('artist')
      .populate('ft')
      .exec(),
  ]);

  if (album === null) {
    const err = new Error('album not found');
    err.status = 404;
    return next(err);
  }

  res.render('album_detail', {
    title: album.title,
    album: album,
    songs: songs,
  });
});
// Display album create form
exports.album_create_get = asyncHandler(async (req, res, next) => {
  // Get Artists and genres to populate form selection
  const [artists, genres] = await Promise.all([
    Artist.find({}).exec(),
    Genre.find({}).exec(),
  ]);
  res.render('album_form', {
    title: 'Create Album',
    artists: artists,
    genres: genres,
  });
});

// Handle album create form

// Display album Delete form

// Handle album delete form

// Display album update form

// Handle album update form
