const Album = require('../models/album');
const Song = require('../models/song');
const Artist = require('../models/artist');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// Display all Artists
exports.artist_list = asyncHandler(async (req, res, next) => {
  const allArtists = await Artist.find().sort({ name: 1 }).exec();
  res.render('artist_list', {
    title: 'Artists',
    artist_list: allArtists,
  });
});

// Display specific artist based on ID
exports.artist_detail = asyncHandler(async (req, res, next) => {
  // Get details of album and find songs associated with album
  const [artist, albumsByArtist] = await Promise.all([
    Artist.findById(req.params.id).exec(),
    Album.find({ artist: req.params.id }, 'title').exec(),
  ]);

  if (artist === null) {
    const err = new Error('artist not found');
    err.status = 404;
    return next(err);
  }

  res.render('artist_detail', {
    title: artist.name,
    artist: artist,
    albums: albumsByArtist,
  });
});

// Display artist create form on GET
exports.artist_create_get = asyncHandler(async (req, res, next) => {
  res.render('artist_form', { title: 'Create Artist' });
});

// Handle Artist create on POST.
exports.artist_create_post = [
  // Validate and sanitize the name field.
  body('name', 'field cant be empty').trim().isLength({ min: 1 }).escape(),
  body('bio', 'field cannot be empty').trim().isLength({ min: 1 }).escape(),
  body('picture').optional({ values: 'falsy' }).trim().isURL().escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Artist object with escaped and trimmed data.
    const artist = new Artist({
      name: req.body.name,
      bio: req.body.bio,
      picture: req.body.picture,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('artist_form', {
        title: 'Create Artist',
        artist: artist,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Artist with same name already exists.
      const artistExists = await Artist.findOne({ name: req.body.name }).exec();
      if (artistExists) {
        // Artist exists, redirect to its detail page.
        res.redirect(artistExists.url);
      } else {
        await artist.save();
        // New artist saved. Redirect to artist detail page.
        res.redirect(artist.url);
      }
    }
  }),
];

//Display Artist delete form on GET
exports.artist_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of artist and all associated albums (in parallel)
  const [artist, albumsByArtist] = await Promise.all([
    Artist.findById(req.params.id).exec(),
    Album.find({ artist: req.params.id }, 'title').exec(),
  ]);
  if (artist === null) {
    // No results.
    const err = new Error('Genre not found');
    err.status = 404;
    return next(err);
  }

  res.render('artist_delete', {
    title: 'Delete Artist',
    artist: artist,
    artist_albums: albumsByArtist,
  });
});

// Handle Artist delete form on POST
exports.artist_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of artist and all associated albums (in parallel)
  const [artist, albumsByArtist] = await Promise.all([
    Artist.findById(req.body.artistid).exec(),
    Album.find({ artist: req.body.artistid }, 'title').exec(),
  ]);
  if (artist === null) {
    // No results.
    const err = new Error('Genre not found');
    err.status = 404;
    return next(err);
  }

  if (albumsByArtist.length > 0) {
    // Artist has albums. Render in same way as for GET route.
    res.render('artist_delete', {
      title: 'Delete Artist',
      artist: artist,
      artist_albums: albumsByArtist,
    });
    return;
  } else {
    //  Artist has no albums. Delete object and redirect to the list of artists.
    await Artist.findByIdAndRemove(req.params.id);
    res.redirect('/artists');
  }
});

// Display Artist update form on GET
exports.artist_update_get = asyncHandler(async (req, res, next) => {
  // Get artist for form
  const artist = await Artist.findById(req.params.id).exec();

  res.render('artist_form', {
    title: 'Update Artist',
    artist: artist,
  });
});

// Handle Artist update on POST.
exports.artist_update_post = [
  // Validate and sanitize the name field.
  body('name', 'field cant be empty').trim().isLength({ min: 1 }).escape(),
  body('bio', 'field cannot be empty').trim().isLength({ min: 1 }).escape(),
  body('picture').optional({ values: 'falsy' }).trim().isURL().escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Artist object with escaped and trimmed data.
    const artist = new Artist({
      name: req.body.name,
      bio: req.body.bio,
      picture: req.body.picture,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('artist_form', {
        title: 'Create Artist',
        artist: artist,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedArtist = await Artist.findByIdAndUpdate(
        req.params.id,
        artist,
        {}
      );
      res.redirect(updatedArtist.url);
    }
  }),
];
