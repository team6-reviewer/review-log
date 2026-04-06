import API from "@/services/api";

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
