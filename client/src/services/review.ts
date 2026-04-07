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

/**
 * 리뷰 목록 조회 함수
 * @param page 페이지 번호
 * @param sort 정렬 기준 ("write_date_desc", "watch_date_desc", "score_desc")
 * @param type 리뷰 타입 ("전체", "영화", "도서")
 * @param keyword 검색어
 * @param searchType 검색 타입 ("total", "title", "content")
 * @param tags 선택된 태그 배열
 * @returns 리뷰 목록 데이터
 * @throws API 요청 실패 시 에러
 */
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

/**
 * 내 리뷰 목록 조회 함수
 * @param page 페이지 번호
 * @param sort 정렬 기준 ("write_date_desc", "watch_date_desc", "score_desc")
 * @param type 리뷰 타입 ("전체", "영화", "도서")
 * @param tags 선택된 태그 배열
 * @returns 내 리뷰 목록 데이터
 * @throws API 요청 실패 시 에러
 */
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

/**
 * 태그 기반 리뷰 추천 함수
 * @param limit 추천 리뷰 수 (기본값: 3)
 * @returns 추천 리뷰 목록 데이터
 * @throws API 요청 실패 시 에러
 */
export const getRecommendedReviews = async (limit: number = 3) => {
  const { data } = await API.get("/reviews/recommendations", {
    params: { limit },
  });
  return data;
};
