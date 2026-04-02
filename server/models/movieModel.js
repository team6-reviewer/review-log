// TMDB API와 통신하여 데이터를 가져오는 모델
const url = `http://api.themoviedb.org/3`;
const posterUrl = `https://image.tmdb.org/t/p/w500`; // 포스터 경로 가져오기 위함

exports.getTopMovies = async () => {

  const token = process.env.TMDB_ACCESS_TOKEN; // TMDB에서 발급받은 토큰

  // 언어, 지역 한국으로하고 현재 상영작 1페이지 조회 (마지막에 추출할 때 5개만 추출)
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
    
    // 가져온 결과 중 상위 5개 작품 추출 및 필요한 데이터(제목,포스터경로) 만 정제하여 반환
    const top5Movies = data.results.slice(0, 5);
    return top5Movies.map(movie => ({
      id: movie.id, // TMDB 관리 영화 ID
      title: movie.title, // 제목
      posterPath: movie.poster_path ? `${posterUrl}${movie.poster_path}` : null
    }));
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

    // 마찬가지로 제목, 포스터 경로만 추출하여 반환
    return data.results.map(movie => ({
      id: movie.id, // TMDB 관리 영화 ID
      title: movie.title,
      posterPath: movie.poster_path ? `${posterUrl}${movie.poster_path}` : null
    }));

  } catch (error) {
    console.error('TMDB 검색 API 호출 에러:', error);
    throw error;
  }
};
