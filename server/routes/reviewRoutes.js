const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

//  TODO: verifyToken 미들웨어(토큰 검사 미들웨어) 추가 예정

// 전체 조회, 사용자가 get방식으로 /reviews로 요청하면 reviewController의 getReviewList함수를 실행하겠다.
router.get('/reviews', reviewController.getReviewList);

// 상세 조회
router.get('/reviews/:id', reviewController.getReviewById);

// 내가 쓴 리뷰 조회
router.get('/auth/me/reviews', reviewController.getMyReviews);


module.exports = router;

