/**
 * 작품 레이아웃형 순위 데이터 객체 내 각 항목 타입
 * - id: 항목 ID
 * - title: 작품 제목
 * - posterPath: 작품 포스터 이미지 경로
 * - type: 작품 유형 ("movie", "book")
 */
export interface RankingItem {
  id: number;
  title: string;
  posterPath: string;
  type?: "movie" | "book";
}

/**
 * 태그 레이아웃형 순위 데이터 객체 내 각 항목 타입
 * - name: 태그 이름
 * - type: 태그 유형 ("genre", "mood")
 */
export interface RankingTag {
  name: string;
  type: "genre" | "mood";
}

/**
 * 순위 캐러셀에서 사용하는 순위 데이터 객체 타입
 * - nowPlaying: 현재 상영작 순위 데이터 배열
 * - bestSellers: 베스트셀러 순위 데이터 배열
 * - mostReviewed: 리뷰 많은 작품 순위 데이터 배열
 * - popularTags: 인기 태그 순위 데이터 배열
 */
export interface RankingData {
  nowPlaying: RankingItem[];
  bestSellers: RankingItem[];
  mostReviewed: RankingItem[];
  popularTags: RankingTag[];
}
