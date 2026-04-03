const pool = require("../config/db");

// 1. 상세 조회
exports.reviewById = async (review_id) => {
  const sql = `SELECT 
                    r.id,
                    r.title,
                    r.content_image,
                    r.type, 
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
                    r.type, 
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
  if (type === "movie" || type === "book") {
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
    const placeholders = tagnames.map(() => "?").join(", ");
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
  if (sort === "score_desc") {
    sql += ` ORDER BY r.score desc`;
  } else if (sort === "watch_date_desc") {
    sql += ` ORDER BY r.watch_date desc`;
  } else if (sort === "write_date_desc") {
    sql += ` ORDER BY r.write_date desc`;
  } else {
    sql += ` ORDER BY r.id desc`;
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
    data: rows,
  };
};

// 3. 내 리뷰 목록 조회
exports.myReviews = async (userId, type, sort, tagnames, page, size) => {
  let sql = `SELECT 
                    r.id,
                    r.title,
                    r.content_image,
                    r.type, 
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
  if (type === "movie" || type === "book") {
    sql += ` AND r.type = ?`;
    countSql += ` AND r.type = ?`;
    params.push(type);
    countParams.push(type);
  }

  // 태그 필터
  if (tagnames && tagnames.length > 0) {
    const placeholders = tagnames.map(() => "?").join(", ");
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
  if (sort === "score_desc") {
    sql += ` ORDER BY r.score desc`;
  } else if (sort === "watch_date_desc") {
    sql += ` ORDER BY r.watch_date desc`;
  } else if (sort === "write_date_desc") {
    sql += ` ORDER BY r.write_date desc`;
  } else {
    sql += ` ORDER BY r.id desc`;
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
    data: rows,
  };
};
