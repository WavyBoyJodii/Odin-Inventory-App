const Album = require('../models/album');
const Song = require('../models/song');
const Artist = require('../models/artist');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// Display all Songs
exports.song_list = asyncHandler(async (req, res, next) => {
  const allSongs = await Song.find()
    .populate('artist')
    .sort({ 'artist.name': 1 })
    .exec();
  res.render('song_list', {
    title: 'All Songs',
    song_list: allSongs,
  });
});

// Display specific Song based on ID
exports.song_detail = asyncHandler(async (req, res, next) => {
  // Get details of song
  const song = await Song.findById(req.params.id)
    .populate('artist')
    .populate('album')
    .populate('ft')
    .exec();

  if (song === null) {
    const err = new Error('artist not found');
    err.status = 404;
    return next(err);
  }

  res.render('song_detail', {
    title: song.title,
    song: song,
  });
});

// Display Song create form on GET
exports.song_create_get = asyncHandler(async (req, res, next) => {
  // Find all artists for form
  const [allArtists, allAlbums] = await Promise.all([
    Artist.find({}).exec(),
    Album.find({}).exec(),
  ]);
  res.render('song_form', {
    title: 'Create Song',
    artists: allArtists,
    albums: allAlbums,
  });
});

// Handle song create form
exports.song_create_post = [
  // Convert the features to an array.
  (req, res, next) => {
    if (!(req.body.ft instanceof Array)) {
      if (typeof req.body.ft === 'undefined') req.body.ft = [];
      else req.body.ft = new Array(req.body.ft);
    }
    next();
  },

  // Validate and Sanitize fields
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('artist', 'Must Choose Artist').trim().isLength({ min: 1 }).escape(),
  body('album', 'Must choose Album').trim().isLength({ min: 1 }).escape(),
  body('ft', 'No ft chosen').optional({ values: 'falsy' }).trim().escape(),
  body('art', 'No art input')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .escape(),
  body('index', 'No index chosen').trim().isNumeric().escape(),
  // Process request after validation and sanitization

  asyncHandler(async (req, res, next) => {
    //Extract the validation errors from a request
    const errors = validationResult(req);

    // Create Song object with escaped and trimmed data
    const song = new Song({
      title: req.body.title,
      artist: req.body.artist,
      album: req.body.album,
      ft: req.body.ft,
      art: req.body.art,
      index: req.body.index,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all Artists and Albums for form
      const [allArtists, allAlbums] = await Promise.all([
        Artist.find().exec(),
        Album.find().exec(),
      ]);

      res.render('song_form', {
        title: 'Create Song',
        artists: allArtists,
        albums: allAlbums,
      });
    } else {
      // Data from form is valid. save Song
      await song.save();
      res.redirect(song.url);
    }
  }),
];

// Display Song Delete form on GET
exports.song_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of song
  const song = await Song.findById(req.params.id)
    .populate('artist')
    .populate('album')
    .populate('ft')
    .exec();

  if (song === null) {
    const err = new Error('artist not found');
    err.status = 404;
    return next(err);
  }

  res.render('song_delete', {
    title: 'Delete Song',
    song: song,
  });
});

// Handle song delete on POST
exports.song_delete_post = asyncHandler(async (req, res, next) => {
  // Delete object and redirect to the list of songs.
  await Song.findByIdAndRemove(req.body.songid);
  res.redirect('/songs');
});

// Handle song Update on GET
exports.song_update_get = asyncHandler(async (req, res, next) => {
  // Find all artists for form
  const [song, allArtists, allAlbums] = await Promise.all([
    Song.findById(req.params.id)
      .populate('artist')
      .populate('album')
      .populate('ft')
      .exec(),
    Artist.find({}).exec(),
    Album.find({}).exec(),
  ]);
  res.render('song_form', {
    title: 'Update Song',
    song: song,
    artists: allArtists,
    albums: allAlbums,
  });
});

// Handle Song Update on POST
exports.song_update_post = [
  // Convert the features to an array.
  (req, res, next) => {
    if (!(req.body.ft instanceof Array)) {
      if (typeof req.body.ft === 'undefined') req.body.ft = [];
      else req.body.ft = new Array(req.body.ft);
    }
    next();
  },

  // Validate and Sanitize fields
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('artist', 'Must Choose Artist').trim().isLength({ min: 1 }).escape(),
  body('album', 'Must choose Album').trim().isLength({ min: 1 }).escape(),
  body('ft', 'No ft chosen').optional({ values: 'falsy' }).trim().escape(),
  body('art', 'No art input')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .escape(),
  body('index', 'No index chosen').trim().isNumeric().escape(),
  // Process request after validation and sanitization

  asyncHandler(async (req, res, next) => {
    //Extract the validation errors from a request
    const errors = validationResult(req);

    // Create Song object with escaped and trimmed data
    const song = new Song({
      title: req.body.title,
      artist: req.body.artist,
      album: req.body.album,
      ft: req.body.ft,
      art: req.body.art,
      index: req.body.index,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all Artists and Albums for form
      const [allArtists, allAlbums] = await Promise.all([
        Artist.find().exec(),
        Album.find().exec(),
      ]);

      res.render('song_form', {
        title: 'Create Song',
        artists: allArtists,
        albums: allAlbums,
      });
    } else {
      // Data from form is valid. Update the record.
      const updatedSong = await Song.findByIdAndUpdate(req.params.id, song, {});
      res.redirect(updatedSong.url);
    }
  }),
];
