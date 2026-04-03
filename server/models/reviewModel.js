const pool = require("../config/db");

// 1. 상세 조회
exports.reviewById = async (review_id) => {
    const sql = `SELECT 
                    r.id,
                    r.title,
                    r.content_image,
                    r.score,
                    r.write_date,
                    r.watch_date,
                    r.content,
                    GROUP_CONCAT(t.tagname SEPARATOR ', ') AS tags                 
                FROM review_Table r
                LEFT JOIN reviewTag_Table rt on r.id = rt.review_id
                LEFT JOIN tag_Table t ON rt.tag_id = t.id 
                WHERE r.id = ?    
                GROUP BY r.id, r.title, r.content_image, r.score, r.write_date, r.watch_date, r.content                          
                `;
    const [rows] = await pool.query(sql, [review_id]);
    return rows[0];
};

// 2. 목록 전체 조회
exports.reviewList = async (type, keyword, sort, tagnames, page, size) => {
    let sql = `SELECT 
                    r.id,
                    r.title,
                    r.content_image,
                    r.score,     
                    r.write_date,
                    r.watch_date,              
                    GROUP_CONCAT(t.tagname SEPARATOR ', ') AS tags
                FROM review_Table r
                LEFT JOIN reviewTag_Table rt on r.id = rt.review_id
                LEFT JOIN tag_Table t ON rt.tag_id = t.id      
                WHERE 1=1          
                `;

    let countSql = `SELECT COUNT(DISTINCT r.id) AS total
                    FROM review_Table r
                    WHERE 1 = 1`;

    const params = [];
    const countParams = [];

    // 영화 & 도서탭 조회
    if (type === 'movie' || type === 'book') {
        sql += ` AND r.type = ?`;
        countSql += ` AND r.type = ?`;
        params.push(type);
        countParams.push(type);
    }

    // 검색 조회 
    if (keyword) {
        sql += ` AND (r.title LIKE ? OR r.content LIKE ?)`;
        countSql += ` AND (r.title LIKE ? OR r.content LIKE ?)`;
        params.push(`%${keyword}%`, `%${keyword}%`);
        countParams.push(`%${keyword}%`, `%${keyword}%`);
    }

    // 태그 필터
    if (tagnames && tagnames.length > 0) {
        const placeholders = tagnames.map(() => '?').join(', ');
        sql += ` AND EXISTS (
                    SELECT 1
                    FROM reviewTag_Table rt2
                    JOIN tag_Table t2 ON rt2.tag_id = t2.id
                    WHERE rt2.review_id = r.id
                    AND t2.tagname IN (${placeholders})
                    )`;

        countSql += ` AND EXISTS (
                    SELECT 1
                    FROM reviewTag_Table rt2
                    JOIN tag_Table t2 ON rt2.tag_id = t2.id
                    WHERE rt2.review_id = r.id
                    AND t2.tagname IN (${placeholders})
                    )`;

        params.push(...tagnames);
        countParams.push(...tagnames);
    }

    sql += ` GROUP BY r.id, r.title, r.content_image, r.score, r.write_date, r.watch_date`;

    // 정렬 (별점순, 관람일자순, 작성일자순)
    if (sort === 'score_desc') {
        sql += ` ORDER BY r.score desc`;
    } else if (sort === 'watch_date_desc') {
        sql += ` ORDER BY r.watch_date desc`;
    } else if (sort === 'write_date_desc') {
        sql += ` ORDER BY r.write_date desc`
    } else {
        sql += ` ORDER BY r.id desc`
    }

    // 페이징 구현 
    const offset = (page - 1) * size;
    sql += ` LIMIT ?, ?`;

    params.push(offset, size);

    const [countRows] = await pool.query(countSql, countParams);
    const [rows] = await pool.query(sql, params);

    return {
        page: Number(page),
        size: Number(size),
        total: countRows[0].total,
        data: rows
    };

};

// 3. 내 리뷰 목록 조회
exports.myReviews = async (userId, type, sort, tagnames, page, size) => {
    let sql = `SELECT 
                    r.id,
                    r.title,
                    r.content_image,
                    r.score,     
                    r.write_date,
                    r.watch_date,              
                    GROUP_CONCAT(t.tagname SEPARATOR ', ') AS tags
                FROM review_Table r
                LEFT JOIN reviewTag_Table rt on r.id = rt.review_id
                LEFT JOIN tag_Table t ON rt.tag_id = t.id      
                WHERE r.user_id = ?       
                `;

    let countSql = `SELECT COUNT(DISTINCT r.id) AS total
                    FROM review_Table r
                    WHERE r.user_id = ? 
                    `;

    const params = [userId];
    const countParams = [userId];

    // 영화 & 도서탭 조회
    if (type === 'movie' || type === 'book') {
        sql += ` AND r.type = ?`;
        countSql += ` AND r.type = ?`;
        params.push(type);
        countParams.push(type);
    }

    // 태그 필터
    if (tagnames && tagnames.length > 0) {
        const placeholders = tagnames.map(() => '?').join(', ');
        sql += ` AND EXISTS (
                    SELECT 1
                    FROM reviewTag_Table rt2
                    JOIN tag_Table t2 ON rt2.tag_id = t2.id
                    WHERE rt2.review_id = r.id
                    AND t2.tagname IN (${placeholders})
                    )`;

        countSql += ` AND EXISTS (
                    SELECT 1
                    FROM reviewTag_Table rt2
                    JOIN tag_Table t2 ON rt2.tag_id = t2.id
                    WHERE rt2.review_id = r.id
                    AND t2.tagname IN (${placeholders})
                    )`;

        params.push(...tagnames);
        countParams.push(...tagnames);
    }

    sql += ` GROUP BY r.id, r.title, r.content_image, r.score, r.write_date, r.watch_date`;

    // 정렬 (별점순, 관람일자순, 작성일자순)
    if (sort === 'score_desc') {
        sql += ` ORDER BY r.score desc`;
    } else if (sort === 'watch_date_desc') {
        sql += ` ORDER BY r.watch_date desc`;
    } else if (sort === 'write_date_desc') {
        sql += ` ORDER BY r.write_date desc`
    } else {
        sql += ` ORDER BY r.id desc`
    }

    // 페이징 구현 
    const offset = (page - 1) * size;
    sql += ` LIMIT ?, ?`;

    params.push(offset, size);

    const [countRows] = await pool.query(countSql, countParams);
    const [rows] = await pool.query(sql, params);

    return {
        page: Number(page),
        size: Number(size),
        total: countRows[0].total,
        data: rows
    };

};




// 리뷰 작성
exports.postReview = async (userId, title, score, content, watch_date, type, content_image, genre_tags, mood_tags) => {
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 우선 리뷰테이블에 리뷰 삽입
        const reviewSql = `
            insert into review_Table (user_id, title, score, content, watch_date, type, content_image) 
            values (?, ?, ?, ?, ?, ?, ?)
        `;
        const [reviewResult] = await connection.query(reviewSql, [userId, title, score, content, watch_date, type, content_image]);
        const newReviewId = reviewResult.insertId; 
        // DB에서 생성된 리뷰의 고유번호를 담음 


        // 이후에 태그를 처리하여 리뷰-태그 테이블에 담기
        let allTags = [];

        if (genre_tags) {
            allTags = allTags.concat(genre_tags);
        }
        if (mood_tags) {
            allTags = allTags.concat(mood_tags);
        }
        // 게시글에 들어가는 장르 태그와 분위기 태그를 모두 하나로 합치고
        // 마지막에 쓰레기 값들 골라내기
        let cleanTags = [];
        for (let tag of allTags) {
            if (tag) { 
                cleanTags.push(tag); // cleanTags에 담음
            }
        }
        allTags = cleanTags;

        // 처리된 태그가 하나도 없는 경우 트랜잭션 롤백 처리
        if (allTags.length === 0) {
            throw new Error("태그 하나 이상 골라야함");
        }

        // 태그 id 찾아옴
        const selectTagsSql = `select id from tag_Table where tagname in (?)`;
        const [tagRows] = await connection.query(selectTagsSql, [allTags]);
        
        // 리뷰-태그 테이블에 리뷰id - 태그 id 매핑 정보 삽입
        const reviewTagValues = tagRows.map(tag => [newReviewId, tag.id]);
        
        // 태그가 DB에 존재하지 않는 태그일 경우 롤백
        if (reviewTagValues.length === 0) {
            throw new Error("DB에 존재하지 않는 태그");
        }
        
        const insertReviewTagSql = `insert into reviewTag_Table (review_id, tag_id) values ?`;
        await connection.query(insertReviewTagSql, [reviewTagValues]);

        await connection.commit(); // 모든 작업 성공하면 최종 반영
        return newReviewId; // 새로 생성된 리뷰의 고유 ID를 담음
    } catch (error) {
        await connection.rollback(); // 작업 중 하나라도 실패하면 모두 되돌림
        console.error("리뷰 작성 트랜잭션 오류:", error);
        throw error; // 에러 컨트롤러로 전달
    } finally {
        connection.release(); // 사용한 DB 커넥션 반환
    }
};


// 리뷰 수정
exports.putReview = async (reviewId, userId, title, score, content, watch_date, type, content_image, genre_tags, mood_tags) => {
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 리뷰 내용 수정하는 쿼리
        const updateReviewSql = `update review_Table set title = ?, score = ?, content = ?, watch_date = ?, type = ?, content_image = ? where id = ? and user_id = ?`;
        const [updateResult] = await connection.query(updateReviewSql, [title, score, content, watch_date, type, content_image, reviewId, userId]);

        if (updateResult.affectedRows === 0) {
            throw new Error("권한이 없거나 존재하지 않는 리뷰임");
        } // 만약에 수정한게 없으면

        // 리뷰-태그 테이블에서 기존에 연결된 태그 모두 삭제하고
        await connection.query(`delete from reviewTag_Table where review_id = ?`, [reviewId]);

        // 새로운 태그 데이터 넣기
        let allTags = [];

        // 장르 태그가 있으면 합치기
        if (genre_tags) {
            allTags = allTags.concat(genre_tags);
        }
        // 분위기 태그가 있으면 합치기
        if (mood_tags) {
            allTags = allTags.concat(mood_tags);
        }

        // 가비지값들 골라내기
        let cleanTags = [];
        for (let tag of allTags) {
            if (tag) { // tag가 존재할 때만 담기
                cleanTags.push(tag);
            }
        }
        allTags = cleanTags;
        // 최종 들어갈 태그 데이터

        // 마찬가지로 태그 하나 이상 필수
        if (allTags.length === 0) {
            throw new Error("태그 하나 이상 골라야함");
        }

        // 태그 db에서 태그 id 찾아와서 담기
        const selectTagsSql = `select id from tag_Table where tagname in (?)`;
        const [tagRows] = await connection.query(selectTagsSql, [allTags]);

        // 리뷰아이디, 태그아이디
        const reviewTagValues = tagRows.map(tag => [reviewId, tag.id]);
        
        // 태그가 DB 존재하지 않는 태그일 경우 롤백
        if (reviewTagValues.length === 0) {
            throw new Error("DB에 존재하지 않는 태그");
        }
        
        const insertReviewTagSql = `insert into reviewTag_Table (review_id, tag_id) values ?`;
        await connection.query(insertReviewTagSql, [reviewTagValues]);

        await connection.commit();
        return reviewId; // 수정된 리뷰의 고유 ID를 담음

    } catch (error) {
        await connection.rollback();
        console.error("리뷰 수정 트랜잭션 오류:", error);
        throw error;
    } finally {
        connection.release();
    }
};

// 리뷰 삭제 
exports.deleteReview = async (reviewId, userId) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 일단 태그 연결 정보 먼저 삭제하고
        await connection.query(`delete from reviewTag_Table where review_id = ?`, [reviewId]);

        // 그 뒤에 리뷰 본문 삭제
        const deleteReviewSql = `delete from review_Table where id = ? and user_id = ?`;
        const [result] = await connection.query(deleteReviewSql, [reviewId, userId]);
        
        // 삭제된 행이 없으면, 남의 글을 지우려 했거나 없는 글이므로 롤백
        if (result.affectedRows === 0) {
            throw new Error("권한이 없거나 존재하지 않는 리뷰임");
        }

        await connection.commit();
        return reviewId; // 새로 생성된 리뷰의 고유 ID를 담음
    } catch (error) {
        await connection.rollback();
        console.error("리뷰 삭제 트랜잭션 오류:", error);
        throw error;
    } finally {
        connection.release();
    }
};
