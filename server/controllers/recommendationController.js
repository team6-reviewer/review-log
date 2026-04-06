const recommendationModel = require("../models/recommendationModel");

// 추천 리뷰 조회
exports.getRecommendedReviews = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. 로그인 사용자의 최고 평점 리뷰 1개 조회
        const topReview = await recommendationModel.topRatedReviewByUser(userId);

        if(!topReview){
            return res.status(404).json({
                error: "기준이 되는 리뷰가 없습니다."
            });
        }

        // 2. 기준 리뷰의 태그 조회
        const tags = await recommendationModel.tagsByReviewId(topReview.id);
        const tagIds = tags.map(tag => tag.id);

        // 3. 태그 하나라도 일치하는 다른 사용자 리뷰 추천 조회
        const recommendations = await recommendationModel.recommendedReviewsByTags(topReview.id, userId, tagIds, 3);

        return res.status(200).json({
            baseReview: topReview,
            baseTags: tags,
            recommendations
        });

    } catch (err) {
        console.error("추천 리뷰 조회 오류: ", err);
        return res.status(500).json({
            error: "추천 리뷰 조회 중 서버 오류가 발생했습니다."
        });
    }
};
