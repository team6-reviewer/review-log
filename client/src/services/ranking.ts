import API from "@/services/api";

export const getRankings = async () => {
  try {
    // 추후 추가 예정
    const [movieRes, bookRes] = await Promise.all([
      API.get("/movie/ranking"),
      API.get("/book/ranking"),
    ]);

    return {
      nowPlaying: movieRes.data,
      bestSellers: bookRes.data,
      // 아직 API 없는 순위는 빈 배열이나 더미로 유지
      mostReviewed: [],
      popularTags: [
        { name: "SF", type: "genre" },
        { name: "잔잔한", type: "mood" },
        { name: "추리", type: "genre" },
        { name: "긴장감", type: "mood" },
        { name: "인문", type: "genre" },
      ],
    };
  } catch (error) {
    console.error("랭킹 데이터 로딩 실패:", error);
    throw error;
  }
};
