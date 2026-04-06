import API from "@/services/api";
import { useAuthStore } from "@/stores/useAuthStore";

interface GetReviewsParams {
  page: number;
  sort: string;
  type: string;
  keyword?: string;
  searchType: string;
  tags: string[];
}

interface GetMyReviewsParams {
  page: number;
  sort: string;
  type: string;
  tags: string[];
}

// 리뷰 목록 조회
export const getReviews = async ({
  page,
  sort,
  type,
  keyword,
  searchType,
  tags,
}: GetReviewsParams) => {
  const userId = useAuthStore.getState().userId;

  const { data } = await API.get("/reviews", {
    params: {
      userId, // 로그인한 사용자 ID도 함께 전달
      page,
      size: 10,
      sort,
      searchType,
      // "전체" 탭일 때는 파라미터 제외
      ...(type !== "전체" && { type: type === "영화" ? "movie" : "book" }),
      ...(keyword && { keyword }),
      tagnames: tags,
    },
    // 배열 파라미터를 'tagnames=SF&tagnames=드라마' 형태로 전달
    paramsSerializer: {
      indexes: null,
    },
  });

  return data;
};

// 내 리뷰 목록 조회
export const getMyReviews = async ({
  page,
  sort,
  type,
  tags,
}: GetMyReviewsParams) => {
  const { data } = await API.get("/reviews/me", {
    params: {
      page,
      size: 10,
      sort,
      tagnames: tags,
      ...(type !== "전체" && { type: type === "영화" ? "movie" : "book" }),
    },
    paramsSerializer: { indexes: null },
  });
  return data;
};
