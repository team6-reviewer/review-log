// TMDB API와 통신하여 데이터를 가져오는 모델
const url = `http://api.themoviedb.org/3`;

exports.getTopMovies = async () => {

  const token = process.env.TMDB_ACCESS_TOKEN; // TMDB에서 발급받은 토큰

  // 언어, 지역 한국으로하고 현재 상영작 1페이지 조회
  const topUrl = `${url}/movie/now_playing?language=ko-KR&region=KR&page=1`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}` // Bearer 토큰 형식
    }
  };

  try {
    
    const response = await fetch(topUrl, options);
    if (!response.ok) {
      throw new Error(`HTTP error${response.status}`);
    }
    const data = await response.json();
    
    // 가져온 결과 중 상위 5개 작품까지
    return data.results.slice(0, 5);
  } catch (error) {
    console.error('TMDB API 호출 에러:', error);
    throw error; // 컨트롤러에서 에러 처리
  }
};

// TMDB API를 통해 영화 제목으로 검색하는 모델
exports.searchMovieByTitle = async (title) => {
  const token = process.env.TMDB_ACCESS_TOKEN;
  // 언어, 지역 한국으로하고 현재 title에 해당하는 작품 반환 
  const searchUrl = `${url}/search/movie?query=${encodeURIComponent(title)}&language=ko-KR`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const response = await fetch(searchUrl, options);
    if (!response.ok) {
      throw new Error(`HTTP error${response.status}`);
    }

    const data = await response.json();
    // 아직 받아온 데이터 정제 안한 상태

    return data.results;

  } catch (error) {
    console.error('TMDB 검색 API 호출 에러:', error);
    throw error;
  }
};
