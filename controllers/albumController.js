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
exports.album_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate and Sanitize fields
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('artist', 'Must Choose Artist').trim().isLength({ min: 1 }).escape(),
  body('release_date', 'Invalid Date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),
  body('genre.*').escape(),
  body('art', 'No art input')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .escape(),
  // Process request after validation and sanitization

  asyncHandler(async (req, res, next) => {
    //Extract the validation errors from a request
    const errors = validationResult(req);

    // Create album object with escaped and trimmed data
    const album = new Album({
      title: req.body.title,
      artist: req.body.artist,
      release_date: req.body.release_date,
      genre: req.body.genre,
      art: req.body.art,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all Artists and Genres for form
      const [allArtists, allGenres] = await Promise.all([
        Artist.find().exec(),
        Genre.find().exec(),
      ]);

      // Mark selected genres as checked
      for (const genre of allGenres) {
        if (album.genre.includes(genre._id)) {
          genre.checked = 'true';
        }
      }
      res.render('album_form', {
        title: 'Create Album',
        artists: allArtists,
        genres: allGenres,
      });
    } else {
      // Data from form is valid. save Album
      await album.save();
      res.redirect(album.url);
    }
  }),
];
// Display album Delete form
exports.album_delete_get = asyncHandler(async (req, res, next) => {
  // Get album for form
  const [album, songs] = await Promise.all([
    Album.findById(req.params.id).populate('artist').populate('genre').exec(),
    Song.find({ album: req.params.id })
      .populate('artist')
      .populate('ft')
      .exec(),
  ]);

  if (album === null) {
    // No results.
    res.redirect('/');
  }
  // Render Book delete form with book data
  res.render('album_delete', {
    title: 'Delete Album',
    album: album,
    songs: songs,
  });
});

// Handle album delete form
exports.album_delete_post = asyncHandler(async (req, res, next) => {
  // Delete object and redirect to the home page.
  await Promise.all([
    Album.findByIdAndRemove(req.body.albumid),
    Song.deleteMany({ album: req.body.albumid }),
  ]);
  res.redirect('/');
});

// Display album update form on GET
exports.album_update_get = asyncHandler(async (req, res, next) => {
  // Get album, all Artists and Genres for form
  const [album, allArtists, allGenres] = await Promise.all([
    Album.findById(req.params.id).populate('artist').exec(),
    Artist.find().exec(),
    Genre.find().exec(),
  ]);

  // Mark selected genres as checked
  for (const genre of allGenres) {
    if (album.genre.includes(genre._id)) {
      genre.checked = 'true';
    }
  }
  res.render('album_form', {
    title: 'Create Album',
    artists: allArtists,
    genres: allGenres,
    album: album,
  });
});

// Handle album update form
exports.album_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate and Sanitize fields
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('artist', 'Must Choose Artist').trim().isLength({ min: 1 }).escape(),
  body('release_date', 'Invalid Date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),
  body('genre.*').escape(),
  body('art', 'No art input')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .escape(),
  // Process request after validation and sanitization

  asyncHandler(async (req, res, next) => {
    //Extract the validation errors from a request
    const errors = validationResult(req);

    // Create album object with escaped and trimmed data
    const album = new Album({
      title: req.body.title,
      artist: req.body.artist,
      release_date: req.body.release_date,
      genre: req.body.genre,
      art: req.body.art,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all Artists and Genres for form
      const [allArtists, allGenres] = await Promise.all([
        Artist.find().exec(),
        Genre.find().exec(),
      ]);

      // Mark selected genres as checked
      for (const genre of allGenres) {
        if (album.genre.includes(genre._id)) {
          genre.checked = 'true';
        }
      }
      res.render('album_form', {
        title: 'Create Album',
        artists: allArtists,
        genres: allGenres,
        album: album,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedAlbum = await Album.findByIdAndUpdate(
        req.params.id,
        album,
        {}
      );
      // Redirect to book detail page.
      res.redirect(updatedAlbum.url);
    }
  }),
];
