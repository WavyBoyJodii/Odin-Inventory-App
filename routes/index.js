var express = require('express');
var router = express.Router();

// Require controller modules
const album_controller = require('../controllers/albumController');
const genre_controller = require('../controllers/genreController');

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

module.exports = router;
