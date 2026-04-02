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


module.exports = router;

