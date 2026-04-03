import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";
import { GENRE_TAGS } from "@/constants/tags";

// 태그 이름을 넣으면 'genre'인지 'mood'인지 반환
const getTagType = (tagName: string): "genre" | "mood" => {
  // GENRE_TAGS 배열에 해당 이름이 있는지 확인
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
}: any) {
  return (
    <section className='flex flex-col gap-6 mt-12'>
      <div className='flex justify-between items-center'>
        <h2 className='text-[24px] font-bold text-main-gray'>
          총 <span className='text-blue-500'>{total}</span>개의 리뷰
        </h2>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2 text-dark-gray'>
            <button
              onClick={() => setPage((prev: number) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              <ChevronLeft className='cursor-pointer enabled:hover:text-main-gray' />
            </button>
            <span className='font-medium'>
              {page} / {Math.ceil(total / 10)}
            </span>
            <button
              onClick={() =>
                setPage((prev: number) =>
                  Math.min(prev + 1, Math.ceil(total / 10)),
                )
              }
              disabled={page === Math.ceil(total / 10)}
            >
              <ChevronRight className='cursor-pointer enabled:hover:text-main-gray' />
            </button>
          </div>
          <select
            className='border border-light-gray p-2 rounded-lg text-sm outline-none bg-white cursor-pointer hover:border-main-gray transition-colors'
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value='rating_desc'>별점순</option>
            <option value='write_date_desc'>작성일자순</option>
            <option value='watch_date_desc'>관람일자순</option>
          </select>
        </div>
      </div>

      <div
        className='grid gap-6'
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
      >
        {reviews.map((review: any) => {
          // 문자열을 배열로 쪼개기
          const tagNames = review.tags ? review.tags.split(", ") : [];

          // 쪼갠 이름들을 객체 형태로 변환
          const refinedTags = tagNames.map((name: string) => ({
            name,
            type: getTagType(name),
          }));

          return (
            <ReviewCard
              key={review.id}
              title={review.title}
              posterUrl={review.content_image}
              date={review.write_date.split("T")[0]} // 날짜만 추출
              rating={review.score}
              tags={refinedTags}
            />
          );
        })}
      </div>
    </section>
  );
}
