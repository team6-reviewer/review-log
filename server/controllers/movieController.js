const movieModel = require('../models/movieModel');

// 프론트엔드로부터의 현재 상영작(1 ~ 5 순위) 요청을 처리하는 컨트롤러
exports.getTopMovies = async (req, res) => {
  try {
    // movieModel에서 상영작 정보를 가져옴
    const results = await movieModel.getTopMovies();
    
    // 성공
    res.status(200).json(results);
  } catch (err) {

    // 실패
    res.status(500).json({error: "영화 상영작 순위 조회 실패(API 에러)" });
  }
};

// 프론트엔드로부터의 영화 검색 요청을 처리하는 컨트롤러
exports.searchMovie = async (req, res) => {
  try {
    // 쿼리 파라미터 처리
    const title = req.query.q;
    if (!title) {
      return res.status(400).json({message: "검색할 영화 제목이 빠져있음" });
    }

    // movieModel에서 영화 검색
    const results = await movieModel.searchMovieByTitle(title);
    
    // 성공
    res.status(200).json(results);
  } catch (error) {

    // 실패
    res.status(500).json({error: "영화 검색 실패(API 에러)" });
  }
};