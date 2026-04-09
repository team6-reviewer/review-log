// TMDB API와 통신하여 데이터를 가져오는 모델
const url = `http://api.themoviedb.org/3`;
const posterUrl = `https://image.tmdb.org/t/p/w500`; // 포스터 경로 가져오기 위함

// TMDB 기준 현재 상영작 상위 5작품 가져오기(상위의 기준은 TMDB 실시간 화제작 기준이라 함)
exports.getTopMovies = async () => {

  const token = process.env.TMDB_ACCESS_TOKEN; // TMDB에서 발급받은 토큰

  // 언어를 한국으로하고 현재 상영작 1페이지 조회 (마지막에 추출할 때 5개만 추출)
  const topUrl = `${url}/movie/now_playing?language=ko-KR&region=KR&page=1`;

  // tmdb api 인증키가 토큰 방식으로 구성되어 있으므로 
  // http 헤더에 담음
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json', // response json 형태로 받기
      Authorization: `Bearer ${token}` // Bearer 토큰 형식
    }
  };

  try {
    // fetch 를 사용하여 TMDB에 요청 보내고 응답을 얻어옴
    const response = await fetch(topUrl, options);

    // 만약 응답이 정상적이지 않으면 에러 throw
    if (!response.ok) {
      throw new Error(`HTTP error${response.status}`);
    }

    // json 응답 데이터 빼오기
    const data = await response.json();
    // 가져온 결과 중 상위 5개 작품 추출 및 필요한 데이터(제목,포스터경로) 만 정제하여 반환
    const top5Movies = data.results.slice(0, 5);
    return top5Movies.map(movie => ({
      id: movie.id, // TMDB 관리 영화 ID
      title: movie.title, // 제목
      posterPath: movie.poster_path ? `${posterUrl}${movie.poster_path}` : null // 포스터 이미지 경로, 만약 없으면 null로 처리
    }));
  } catch (error) {
    console.error('TMDB API 호출 에러:', error);
    throw error; // 컨트롤러에서 에러 처리
  }
};

// TMDB API를 통해 영화 제목으로 검색하는 모델
exports.searchMovieByTitle = async (title) => {
  // TBDB 토큰 (api 인증키)
  const token = process.env.TMDB_ACCESS_TOKEN;
  // 언어, 지역 한국으로하고 현재 title에 해당하는 작품 반환 
  const searchUrl = `${url}/search/movie?query=${encodeURIComponent(title)}&language=ko-KR`;

  // 마찬가지로 토큰(인증키)를 헤더에 담기
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json', // json 형식으로 데이터 반환 받겠다는 뜻
      Authorization: `Bearer ${token}` // bearer 토큰 담고
    }
  };

  try {
    // fetch 메소드 사용하여 TMDB에 요청보내고 response를 받아옴
    const response = await fetch(searchUrl, options);
    // 만약 응답이 정상적이지 않으면 에러 throw
    if (!response.ok) {
      throw new Error(`HTTP error${response.status}`);
    }

    // json 응답 데이터 빼오기
    const data = await response.json();

    // 마찬가지로 제목, 포스터 경로만 추출하여 반환
    return data.results.map(movie => ({
      id: movie.id, // TMDB 관리 영화 ID
      title: movie.title, // 영화 제목
      posterPath: movie.poster_path ? `${posterUrl}${movie.poster_path}` : null // 포스터의 경로, 만약 없으면 null
    }));

  } catch (error) {
    console.error('TMDB 검색 API 호출 에러:', error);
    throw error;
  }
};
