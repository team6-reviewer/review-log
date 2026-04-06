const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const authMiddleware = require("../middleware/authMiddleware");

/* 
  이 줄 아래에 있는 모든 라우터는
  자동으로 authMiddleware를 거치게 됨.
  AccessToken이 유효한 사람만 접근 가능(Private) 
*/
router.use(authMiddleware);

// GET /api/movie/ranking
router.get("/ranking", movieController.getTopMovies);

// GET /api/movie/search?q={title}
router.get("/search", movieController.searchMovie);

module.exports = router;
