const reviewModel = require("../models/reviewModel");

// 1. 상세조회
exports.getReviewById = async (req, res) => {   
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "잘못된 ID입니다." });
        }

        const result = await reviewModel.reviewById(id);

        if (!result) {
            return res.status(404).json({ error: "리뷰를 찾을 수 없습니다." });
        }

        res.json(result);

    } catch (err) {
        console.error("상세 조회 오류:", err);
        res.status(500).json({ error: "상세 조회 중 서버 오류가 발생했습니다." });
    }
};

// 2. 목록 전체 조회
exports.getReviewList = async (req, res) => {
    try {
        const { type, keyword, sort } = req.query;
        const tagnames = req.query.tagnames
            ? Array.isArray(req.query.tagnames)
                ? req.query.tagnames
                : [req.query.tagnames]
            : [];
        const page = Math.max(1, Number(req.query.page) || 1);
        const size = Math.max(1, Number(req.query.size) || 5);
        const result = await reviewModel.reviewList(type, keyword, sort, tagnames, page, size);
        res.json(result);

    } catch (err) {
        console.error("목록 조회 오류: ", err);
        res.status(500).json({ error: "목록 조회 중 서버 오류가 발생했습니다." });
    }
};

// 3. 내 리뷰 목록 조회
exports.getMyReviews = async (req, res) => {
    try {
        //  TODO: 인증 미들웨어에서 req.user 주입 필요
        const userId = req.user.id; 
        const { type, sort } = req.query;
        const tagnames = req.query.tagnames
            ? Array.isArray(req.query.tagnames)
                ? req.query.tagnames
                : [req.query.tagnames]
            : [];
        const page = Math.max(1, Number(req.query.page) || 1);
        const size = Math.max(1, Number(req.query.size) || 5);
        const result = await reviewModel.myReviews(userId, type, sort, tagnames, page, size);
        res.json(result);

    } catch (err) {
        console.error("내 리뷰 목록 조회 오류: ", err);
        res.status(500).json({ error: "내 리뷰 목록 조회 중 서버 오류가 발생했습니다." });
    }
};