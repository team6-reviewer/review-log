// 알라딘 API와 통신하여 데이터를 가져오는 모델
const aladinBaseUrl = 'http://www.aladin.co.kr/ttb/api';

// 알라딘 도서 판매량 순위(베스트셀러) 조회 (상위 5개)
exports.getTopBooks = async () => {
  const ttbKey = process.env.ALADIN_TTB_KEY; // 알라딘에서 발급받은 TTB Key (api 인증키)
  
  // QueryType=Bestseller (판매량 순위), MaxResults=5(최대결과 5개), SearchTarget=Book(국내도서), output=js 이고,
  // 이는 알라딘 사이트에서의 주간 베스트 셀러 도서 상위 5개를 가져온거라 보면 됨
  const topUrl = `${aladinBaseUrl}/ItemList.aspx?ttbkey=${ttbKey}&QueryType=Bestseller&MaxResults=5&start=1&SearchTarget=Book&output=js&Version=20131101`;

  try {
    // fetch 메소드를 사용하여 알라딘 api 에 요청보내고 response 받아옴
    const response = await fetch(topUrl);
    // 만약 응답이 정상적이지 않으면 에러 throw
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    // json 응답 데이터 빼오기
    const data = await response.json();
    
    // 가져온 결과 중에서 알라딘 도서 고유 id, 제목, 포스터 경로만 정제하여 반환
    return data.item.map(book => ({
      id: book.itemId, // 알라딘 관리 도서 ID
      title: book.title, // 제목
      posterPath: book.cover ? book.cover.replace('/coversum/', '/cover500/') : null // 표지경로, 없으면 null
      // 저해상도의 표지 이미지를 고해상도 500px로 바꿈
    }));

  } catch (error) {
    console.error('알라딘 판매량 순위 API 호출 에러:', error);
    throw error;
  }
};


// 알라딘 API를 통해 도서 제목으로 검색하는 모델
exports.searchBookByTitle = async (title) => {
  // 알라딘 api 인증키
  const ttbKey = process.env.ALADIN_TTB_KEY;
  // QueryType=Title 제목검색, MaxResults=10 결과 10개 반환, SearchTarget=Book 도서 검색
  // 알라딘에서 제목으로 도서 검색해오는 url
  const searchUrl = `${aladinBaseUrl}/ItemSearch.aspx?ttbkey=${ttbKey}&Query=${encodeURIComponent(title)}&QueryType=Title&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101`;

  try {
    // fetch 메소드를 사용하여 알라딘 api에 요청보내고 response 받아옴
    const response = await fetch(searchUrl);
    // 만약 응답이 정상적이지 않으면 에러 throw
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    // json 응답 데이터
    const data = await response.json();

    // 가져온 결과 중에서 알라딘 도서 고유 id, 제목, 포스터 경로만 정제하여 반환  
    return data.item.map(book => ({
      id: book.itemId, // 알라딘 관리 도서 ID
      title: book.title, // 제목
      posterPath: book.cover ? book.cover.replace('/coversum/', '/cover500/') : null // 표지경로, 없으면 null
      // 저해상도의 표지 이미지를 고해상도 500px로 바꿈
    }));
  } catch (error) {
    console.error('알라딘 검색 API 호출 에러:', error);
    throw error;
  }
};