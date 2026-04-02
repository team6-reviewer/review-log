// 알라딘 API와 통신하여 데이터를 가져오는 모델
const aladinBaseUrl = 'http://www.aladin.co.kr/ttb/api';

// 알라딘 도서 판매량 순위(베스트셀러) 조회 (상위 5개)
exports.getTopBooks = async () => {
  const ttbKey = process.env.ALADIN_TTB_KEY; // 알라딘에서 발급받은 TTB Key
  
  // QueryType=Bestseller (판매량 순위), SearchTarget=Book(국내도서), output=js 즉 알라딘 사이트에서의 주간 베스트 셀러라고 보면 됨
  const topUrl = `${aladinBaseUrl}/ItemList.aspx?ttbkey=${ttbKey}&QueryType=Bestseller&MaxResults=5&start=1&SearchTarget=Book&output=js&Version=20131101`;

  try {
    const response = await fetch(topUrl);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    
    return data.item.map(book => ({
      title: book.title, // 제목
      posterPath: (book.cover).replace('/coversum/', '/cover500/') || null // 표지경로, 없으면 null
    }));
  } catch (error) {
    console.error('알라딘 판매량 순위 API 호출 에러:', error);
    throw error;
  }
};


// 알라딘 API를 통해 도서 제목으로 검색하는 모델
exports.searchBookByTitle = async (title) => {
  const ttbKey = process.env.ALADIN_TTB_KEY;
  const searchUrl = `${aladinBaseUrl}/ItemSearch.aspx?ttbkey=${ttbKey}&Query=${encodeURIComponent(title)}&QueryType=Title&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101`;

  try {
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();

    return data.item.map(book => ({
      title: book.title, // 제목
      posterPath: (book.cover).replace('/coversum/', '/cover500/') || null // 표지경로, 없으면 null
    }));
  } catch (error) {
    console.error('알라딘 검색 API 호출 에러:', error);
    throw error;
  }
};