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
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "인증이 필요합니다." });
        }

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

// 리뷰 작성
exports.postReview = async (req, res) => {
    
    try{
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "인증이 필요합니다." });
        }

        // DB상 사용자 고유번호
        const userId = req.user.id;
        // 콘텐츠 제목, 콘텐츠 평점, 콘텐츠 감상평, 콘텐츠 시청날짜, 컨텐츠 종료(book / movie), 표지 이미지 url, 장르 태그, 분위기 태그, 
        const {title, score, content, watch_date, type, content_image, genre_tags, mood_tags} = req.body;

        if(!title || !score || !content || !watch_date || !type || !content_image || (!genre_tags && !mood_tags)) {
            return res.status(400).json({message: "바디 내용 중 일부가 누락" });
        }

        const result = await reviewModel.postReview(userId, title, score, content, watch_date, type, content_image, genre_tags, mood_tags);
        res.status(201).json(result);

    } catch(error) {
       
        res.status(500).json({ error: "리뷰 작성 중 에러 발생" });
    }
}

// 리뷰 수정
exports.patchReview = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "인증이 필요합니다." });
        }

        const reviewId = Number(req.params.id);
        if (isNaN(reviewId)) {
            return res.status(400).json({ error: "잘못된 reveiw id" });
        }

        const userId = req.user.id; 
        const { title, score, content, watch_date, type, content_image, genre_tags, mood_tags } = req.body;
        const result = await reviewModel.patchReview(reviewId, userId, title, score, content, watch_date, type, content_image, genre_tags, mood_tags);
        res.status(200).json(result);
    } catch(error) {
        
        res.status(500).json({ error: "리뷰 수정 중 에러 발생"});
    }
}

// 리뷰 삭제
exports.deleteReview = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "인증이 필요합니다." });
        }

        const reviewId = Number(req.params.id); 
        if (isNaN(reviewId)) {
            return res.status(400).json({ error: "잘못된 reveiw id" });
        }

        const userId = req.user.id; 
        const result = await reviewModel.deleteReview(reviewId, userId);
        res.status(200).json(result);
    }
    catch(error) {
        res.status(500).json({ error: "리뷰 삭제 중 에러 발생" });
    }
}