const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");

/* 
  이 줄 아래에 있는 모든 라우터는
  자동으로 authMiddleware를 거치게 됨.
  AccessToken이 유효한 사람만 접근 가능(Private) 
*/
router.use(authMiddleware);

// GET /api/book/ranking
router.get("/ranking", bookController.getTopBooks);

// GET /api/book/search?q={title}
router.get("/search", bookController.searchBook);

module.exports = router;
