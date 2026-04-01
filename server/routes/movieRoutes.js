const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// GET /api/movies/ranking
router.get('/ranking', movieController.getTopMovies);

// GET /api/movie/search?q={title}
router.get('/search', movieController.searchMovie);

module.exports = router;