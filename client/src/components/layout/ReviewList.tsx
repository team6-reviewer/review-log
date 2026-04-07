import ReviewCard from "@/components/ReviewCard";
import { GENRE_TAGS } from "@/constants/tags";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

// 태그 이름으로부터 타입을 유추하는 헬퍼 함수
const getTagType = (tagName: string): "genre" | "mood" => {
  const isGenre = GENRE_TAGS.some((tag) => tag.tagname === tagName);
  return isGenre ? "genre" : "mood";
};

interface Review {
  id: number;
  user_id: number;
  title: string;
  type: "movie" | "book";
  score: number;
  tags: string;
  write_date: string;
  content_image: string;
  isMine?: boolean;
}

interface ReviewListProps {
  reviews: Review[];
  total: number;
  isLoading: boolean;
  page: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  sort: string;
  setSort: (sort: string) => void;
  keyword: string;
  onReset: () => void;
  onReviewClick: (id: number) => void;
  onEditClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
}

/**
 * 리뷰 목록 컴포넌트
 * @param reviews 리뷰 데이터 배열
 * @param total 전체 리뷰 개수
 * @param isLoading 로딩 상태
 * @param page 현재 페이지 번호
 * @param setPage 페이지 번호 업데이트 함수
 * @param sort 정렬 기준
 * @param setSort 정렬 기준 업데이트 함수
 * @param keyword 검색어
 * @param onReset 초기화 핸들러 함수
 * @param onReviewClick 리뷰 카드 클릭 핸들러 함수 (리뷰 상세 조회 모달 오픈)
 * @param onEditClick 리뷰 수정 클릭 핸들러 함수 (리뷰 수정 모달 오픈)
 * @param onDeleteClick 리뷰 삭제 클릭 핸들러 함수 (리뷰 삭제 API 호출)
 */
export default function ReviewList({
  reviews,
  total,
  isLoading,
  page,
  setPage,
  sort,
  setSort,
  keyword,
  onReset,
  onReviewClick,
  onEditClick,
  onDeleteClick,
}: ReviewListProps) {
  // 로딩 중일 때 보여줄 스켈레톤 UI
  if (isLoading) {
    return (
      <section className='flex flex-col gap-6 mt-12'>
        {/* 상단 헤더 부분 스켈레톤 */}
        <div className='flex justify-between items-center animate-pulse'>
          <div className='h-8 w-48 bg-gray-200 rounded-md' />
          <div className='h-10 w-32 bg-gray-200 rounded-lg' />
        </div>

        {/* 카드 목록 그리드 스켈레톤 */}
        <div
          className='grid gap-6 items-start'
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          }}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className='flex flex-col gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm animate-pulse'
            >
              {/* 포스터 영역 */}
              <div className='w-full aspect-[3/4] bg-gray-200 rounded-lg' />
              {/* 타이틀 영역 */}
              <div className='h-5 bg-gray-200 rounded w-3/4' />
              {/* 날짜/평점 영역 */}
              <div className='flex justify-between'>
                <div className='h-4 bg-gray-100 rounded w-1/3' />
                <div className='h-4 bg-gray-100 rounded w-1/4' />
              </div>
              {/* 태그 영역 */}
              <div className='flex gap-2'>
                <div className='h-6 bg-gray-50 rounded-full w-12' />
                <div className='h-6 bg-gray-50 rounded-full w-16' />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className='flex flex-col gap-6 mt-12'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <h2 className='text-[24px] font-bold text-main-gray'>
            {keyword ? (
              <>
                <span className='text-movie-title'>&quot;{keyword}&quot;</span>
                의 검색 결과
                <span className='ml-2 font-normal text-[20px] text-gray-400'>
                  ({total}개)
                </span>
              </>
            ) : (
              <>
                전체 <span className='text-movie-title'>{total}</span>개의 리뷰
              </>
            )}
          </h2>
          {(keyword || sort !== "write_date_desc" || page !== 1) && (
            <button
              onClick={onReset}
              className='flex items-center gap-1 text-[14px] text-gray-400 hover:text-main-gray transition-colors'
            >
              <RotateCcw size={14} /> <span>초기화</span>
            </button>
          )}
        </div>

        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2 text-dark-gray'>
            <button
              onClick={() => setPage((p: number) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className='disabled:opacity-50 disabled:cursor-default'
            >
              <ChevronLeft />
            </button>
            <span className='font-medium'>
              {page} / {Math.ceil(total / 10) || 1}
            </span>
            <button
              onClick={() =>
                setPage((p: number) => Math.min(p + 1, Math.ceil(total / 10)))
              }
              disabled={page === Math.ceil(total / 10) || total === 0}
              className='disabled:opacity-50 disabled:cursor-default'
            >
              <ChevronRight />
            </button>
          </div>
          <select
            className='border border-light-gray p-2 rounded-lg text-sm outline-none bg-white'
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value='write_date_desc'>작성일자순</option>
            <option value='score_desc'>별점순</option>
            <option value='watch_date_desc'>감상일자순</option>
          </select>
        </div>
      </div>

      {/* 리뷰 카드 목록 */}
      {reviews.length === 0 ? (
        <div>
          <p className='text-center text-main-gray mt-20'>
            작성된 리뷰가 없습니다.
          </p>
        </div>
      ) : (
        <div
          className='grid gap-6 items-start'
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          }}
        >
          {reviews.map((review: Review) => {
            const tagNames = review.tags ? review.tags.split(", ") : [];
            const refinedTags = [
              {
                name: review.type === "movie" ? "영화" : "도서",
                type: "type" as const,
              },
              ...tagNames.map((name: string) => ({
                name,
                type: getTagType(name),
              })),
            ];

            return (
              <ReviewCard
                key={review.id}
                title={review.title}
                posterUrl={review.content_image}
                date={review.write_date.split("T")[0]}
                rating={review.score}
                tags={refinedTags}
                isMine={review.isMine !== undefined ? review.isMine : true}
                onClick={() => onReviewClick(review.id)} // 상세 조회 모달 오픈
                onEdit={(e: any) => {
                  e.stopPropagation();
                  onEditClick(review.id);
                }} // 수정 모달 오픈
                onDelete={(e: any) => {
                  e.stopPropagation();
                  onDeleteClick(review.id);
                }} // 삭제 API 호출
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
