const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require("../middleware/authMiddleware");

// 전체 조회
router.get('/reviews', verifyToken, reviewController.getReviewList);

// 상세 조회
router.get('/reviews/:id', verifyToken, reviewController.getReviewById);

// 내가 쓴 리뷰 조회
router.get('/auth/me/reviews', verifyToken, reviewController.getMyReviews);



// 리뷰 생성
router.post('/reviews', verifyToken, reviewController.postReview);

// 리뷰 수정
router.patch('/reviews/:id', verifyToken, reviewController.patchReview);

// 리뷰 삭제
router.delete('/reviews/:id', verifyToken, reviewController.deleteReview);


module.exports = router;

