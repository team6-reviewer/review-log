import defaultImg from "@/assets/defaultImg.png";
import ReviewCard from "@/components/ReviewCard";
import { getRecommendedReviews } from "@/services/review";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

/**
 * 태그 기반 리뷰 추천 섹션 컴포넌트
 * @param onReviewClick 리뷰 카드 클릭 시 호출되는 콜백 함수 (리뷰 상세 조회 모달 오픈)
 */
export default function RecommendSection({
  onReviewClick,
}: {
  onReviewClick: (id: number) => void;
}) {
  // 마우스 드래그 스크롤 관련 상태 관리
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);

  // 태그 기반 리뷰 추천 목록 조회
  const { data, isLoading } = useQuery({
    queryKey: ["reviews", "recommendations"],
    queryFn: () => getRecommendedReviews(3),
  });

  // 마우스 드래그 스크롤 구현
  const onDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDrag(true);
    setStartX(e.pageX + (scrollRef.current?.scrollLeft || 0));
  };

  const onDragEnd = () => {
    setIsDrag(false);
  };

  // 드래그 중일 때 마우스 이동에 따라 스크롤 위치 업데이트
  const onDragMove = (e: React.MouseEvent) => {
    if (!isDrag || !scrollRef.current) return;
    scrollRef.current.scrollLeft = startX - e.pageX;
  };

  return (
    <section className='min-h-[272px] shadow-sm bg-tag-recomm px-8 py-6 rounded-lg flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden'>
      <div className='flex flex-col items-center lg:items-start gap-2'>
        <div className='flex flex-row gap-2 lg:flex-col lg:gap-0 z-10 shrink-0 min-w-fit select-none text-[clamp(20px,3vw,32px)] font-bold leading-tight whitespace-nowrap text-main-gray'>
          <span>당신도 좋아할 </span>
          <span>다른 작품 추천 리뷰</span>
        </div>
        <span className='text-main-gray text-sm break-keep'>
          당신의 마음에 든 작품의 태그를 바탕으로 선정했어요.
        </span>
      </div>

      {/* 드래그 되는 동안 마우스 커서도 구분 */}
      <div
        ref={scrollRef}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        className={`flex flex-row lg:justify-end justify-center flex-nowrap gap-4 w-full overflow-x-auto px-1 pb-1 scrollbar-hide ${
          isDrag ? "cursor-grabbing" : "cursor-grab"
        } active:cursor-grabbing transition-all`}
      >
        {!data || data?.length === 0 || data?.recommendations?.length === 0 ? (
          <div className='flex flex-col items-center lg:items-start gap-2 z-10 shrink-0 min-w-fit select-none text-dark-gray'>
            <span className=' text-[clamp(20px,3vw,32px)] font-bold leading-tight whitespace-nowrap'>
              당신과 취향이 같은 리뷰를 찾고 있어요.
            </span>
            <span className='text-sm'>
              더 다양한 태그로 기록을 남겨주시면 더 빠르게 추천 리뷰를
              찾아드릴게요.
            </span>
          </div>
        ) : (
          data?.recommendations?.map((review: any) => (
            <div
              key={review.id}
              className='shrink-0 select-none pointer-events-none'
            >
              <div className='pointer-events-auto'>
                <ReviewCard
                  title={review.title}
                  posterUrl={review.content_image || defaultImg}
                  date={review.write_date.split("T")[0]}
                  rating={Number(review.score)}
                  isSimple={true}
                  onClick={() => onReviewClick(review.id)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
