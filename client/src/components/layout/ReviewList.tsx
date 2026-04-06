import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";
import { GENRE_TAGS } from "@/constants/tags";

// 태그 이름으로부터 타입을 유추하는 헬퍼 함수
const getTagType = (tagName: string): "genre" | "mood" => {
  const isGenre = GENRE_TAGS.some((tag) => tag.tagname === tagName);
  return isGenre ? "genre" : "mood";
};

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
}: any) {
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
            <option value='watch_date_desc'>관람일자순</option>
          </select>
        </div>
      </div>

      {/* 리뷰 카드 목록 */}
      <div
        className='grid gap-6 items-start'
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
      >
        {reviews.map((review: any) => {
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
              date={review.watch_date.split("T")[0]}
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
    </section>
  );
}
