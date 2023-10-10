var express = require('express');
var router = express.Router();

// Require controller modules
const album_controller = require('../controllers/albumController');

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

// POST request for updating an album

// Get request for one Album
router.get('/album/:id', album_controller.album_detail);

module.exports = router;
