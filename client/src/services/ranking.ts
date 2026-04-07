import API from "@/services/api";

/**
 * 순위 데이터 (현재 상영작, 베스트셀러, 리뷰 많은 작품, 인기 태그) 를 서버에서 가져오는 함수
 * @returns 각 카테고리별 순위 데이터를 포함하는 객체
 * @throws API 요청 실패 시 에러
 */
export const getRankings = async () => {
  try {
    // 추후 추가 예정
    const [movieRes, bookRes, rankRes, tagRes] = await Promise.all([
      API.get("/movie/ranking"),
      API.get("/book/ranking"),
      API.get("/reviews/rank/most-reviewed"),
      API.get("/reviews/rank/most-used-tag"),
    ]);

    return {
      nowPlaying: movieRes.data,
      bestSellers: bookRes.data,
      // 아직 API 없는 순위는 더미로 유지
      mostReviewed: rankRes.data,
      popularTags: tagRes.data,
    };
  } catch (error) {
    console.error("랭킹 데이터 로딩 실패:", error);
    throw error;
  }
};
