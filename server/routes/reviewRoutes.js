const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

/* 
  이 줄 아래에 있는 모든 라우터는
  자동으로 authMiddleware를 거치게 됨.
  AccessToken이 유효한 사람만 접근 가능(Private) 
*/
router.use(authMiddleware);

// 전체 조회
router.get("/reviews", reviewController.getReviewList);

// 상세 조회
router.get("/reviews/:id", reviewController.getReviewById);

// 내가 쓴 리뷰 조회
router.get("/reviews/me", reviewController.getMyReviews);

// 리뷰 생성
router.post("/reviews", reviewController.postReview);

// 리뷰 수정
router.put("/reviews/:id", reviewController.putReview);

// 리뷰 삭제
router.delete('/reviews/:id', verifyToken, reviewController.deleteReview);

// 가장 리뷰 많은 작품 순위 상위 5개
router.get('/reviews/rank/most-reviewed', verifyToken, reviewController.getTopReviewed);


module.exports = router;
