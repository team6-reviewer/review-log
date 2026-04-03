const bookModel = require('../models/bookModel');

// 프론트엔드로부터의 도서 판매량 순위(상위 5개) 요청을 처리하는 컨트롤러
exports.getTopBooks = async (req, res) => {
  try {
    const results = await bookModel.getTopBooks();
    
    // 성공
    res.status(200).json(results);
  } catch (err) {
    // 실패
    res.status(500).json({ error: "도서 판매량 순위 조회 실패(API 에러)", message: err.message});
  }
};


// 프론트엔드로부터의 도서 검색 요청을 처리하는 컨트롤러
exports.searchBook = async (req, res) => {
  try {
    const title = req.query.q;
    if (!title) {
      return res.status(400).json({ message: "검색할 도서 제목이 빠져있음" });
    }

    const results = await bookModel.searchBookByTitle(title);
    
    // 성공
    res.status(200).json(results);
  } catch (error) {
    // 실패
    res.status(500).json({ error: "도서 검색 실패(API 에러)", message:error.message});
  }
};