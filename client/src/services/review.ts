import API from "@/services/api";

interface GetReviewsParams {
  page: number;
  sort: string;
  type: string;
  keyword?: string;
  searchType: string;
  tags: string[];
}

export const getReviews = async ({
  page,
  sort,
  type,
  keyword,
  searchType,
  tags,
}: GetReviewsParams) => {
  // paramsSerializer를 호출 시점에 바로 적용
  const { data } = await API.get("/reviews", {
    params: {
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
