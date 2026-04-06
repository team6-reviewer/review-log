import API from "@/services/api";
import defaultImg from "@/assets/defaultImg.png";

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
      // 아직 API 없는 순위는 더미로 유지
      mostReviewed: [
        { id: 1, title: "영화 A", posterPath: defaultImg },
        { id: 2, title: "영화 B", posterPath: defaultImg },
        { id: 3, title: "영화 C", posterPath: defaultImg },
        { id: 4, title: "영화 D", posterPath: defaultImg },
        { id: 5, title: "영화 E", posterPath: defaultImg },
      ],
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
