const pool = require("../config/db");

// 1. 로그인 사용자의 최고 평점 리뷰 1개 조회
exports.topRatedReviewByUser = async (userId) => {
    const sql = `SELECT 
                    r.id, 
                    r.title, 
                    r.score, 
                    r.type, 
                    r.write_date
                 FROM review_Table r
                 WHERE r.user_id = ?
                 ORDER BY r.score DESC, r.write_date DESC
                 LIMIT 1
                 `;

    const [rows] = await pool.query(sql, [userId]);
    return rows[0] || null;
};

// 2. 기준 리뷰의 태그 조회
exports.tagsByReviewId = async (reviewId) => {
    const sql = `SELECT 
                    t.id,
                    t.tagname
                FROM reviewTag_Table rt
                JOIN tag_Table t ON rt.tag_id = t.id
                WHERE rt.review_id = ?
                `;

    const [rows] = await pool.query(sql, [reviewId]);
    return rows;
};

// 3. 태그 하나라도 일치하는 다른 사용자 리뷰 추천 조회
exports.recommendedReviewsByTags = async (reviewId, userId, tagIds, limit = 3) => {
    // 태그 없으면 빈 배열 반환 
    if (!tagIds || tagIds.length === 0) {
        return [];
    }

    const placeholders = tagIds.map(() => "?").join(", ");

    const sql = `SELECT
                    ranked.id AS id,
                    ranked.title AS title,
                    ranked.score AS score,
                    ranked.write_date AS write_date,
                    ranked.type AS type,
                    ranked.content_image AS content_image
                FROM (
                        SELECT
                        r.id,
                        r.title,
                        r.score,
                        r.write_date,
                        r.type,
                        r.content_image,
                        ROW_NUMBER() OVER (
                                            PARTITION BY r.title
                                            ORDER BY r.score DESC, r.write_date DESC, r.id ASC
                                         ) AS rn
                        FROM review_Table r
                        JOIN reviewTag_Table rt ON r.id = rt.review_id
                        WHERE r.id != ?
                        AND r.user_id != ?
                        AND rt.tag_id IN (${placeholders})
                    ) ranked
                WHERE ranked.rn = 1
                ORDER BY ranked.score DESC, ranked.write_date DESC
                LIMIT ?`;

    const params = [reviewId, userId, ...tagIds, limit];
    const [rows] = await pool.query(sql, params);
    return rows;
};