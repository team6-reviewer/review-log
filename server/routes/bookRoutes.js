const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// GET /api/book/ranking
router.get('/ranking', bookController.getTopBooks);

// GET /api/book/search?q={title}
router.get('/search', bookController.searchBook);

module.exports = router;