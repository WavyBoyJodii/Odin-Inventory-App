var express = require('express');
var router = express.Router();

// Require controller modules
const album_controller = require('../controllers/albumController');
const genre_controller = require('../controllers/genreController');
const artist_controller = require('../controllers/artistController');
const song_controller = require('../controllers/songController');

/* GET home page. */
router.get('/', album_controller.album_list);

// GET request for creating an album
router.get('/album/create', album_controller.album_create_get);

// POST request for creating an album
router.post('/album/create', album_controller.album_create_post);

// GET request for deleting an album
router.get('/album/:id/delete', album_controller.album_delete_get);

// POST request for deleting an album
router.post('/album/:id/delete', album_controller.album_delete_post);

// GET request for updating an album
router.get('/album/:id/update', album_controller.album_update_get);

// POST request for updating an album
router.post('/album/:id/update', album_controller.album_update_post);

// Get request for one Album
router.get('/album/:id', album_controller.album_detail);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
// router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
// router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

/// ARTIST ROUTES ///

// GET request for creating an Artist. NOTE This must come before route that displays Artist (uses id).
router.get('/artist/create', artist_controller.artist_create_get);

//POST request for creating Artist.
router.post('/artist/create', artist_controller.artist_create_post);

// GET request to delete Artist.
router.get('/artist/:id/delete', artist_controller.artist_delete_get);

// POST request to delete Artist.
router.post('/artist/:id/delete', artist_controller.artist_delete_post);

// GET request to update Artist.
router.get('/artist/:id/update', artist_controller.artist_update_get);

// POST request to update Artist.
router.post('/artist/:id/update', artist_controller.artist_update_post);

// GET request for one Artist.
router.get('/artist/:id', artist_controller.artist_detail);

// GET request for list of all Artists.
router.get('/artists', artist_controller.artist_list);

/// SONG ROUTES ///

// GET request for creating an Song. NOTE This must come before route that displays Artist (uses id).
router.get('/song/create', song_controller.song_create_get);

//POST request for creating Song.
router.post('/song/create', song_controller.song_create_post);

// GET request to delete Song.
router.get('/song/:id/delete', song_controller.song_delete_get);

// POST request to delete Song.
router.post('/song/:id/delete', song_controller.song_delete_post);

// GET request to update Song.
router.get('/song/:id/update', song_controller.song_update_get);

// POST request to update Song.
router.post('/song/:id/update', song_controller.song_update_post);

// GET request for one Song.
router.get('/song/:id', song_controller.song_detail);

// GET request for list of all Songs.
router.get('/songs', song_controller.song_list);

module.exports = router;
