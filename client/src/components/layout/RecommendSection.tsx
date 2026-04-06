import { useRef, useState } from "react";
import ReviewCard from "@/components/ReviewCard";
import defaultImg from "@/assets/defaultImg.png";

export default function RecommendSection() {
  // 마우스 드래그 스크롤 구현
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);

  const onDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDrag(true);
    setStartX(e.pageX + (scrollRef.current?.scrollLeft || 0));
  };

  const onDragEnd = () => {
    setIsDrag(false);
  };

  const onDragMove = (e: React.MouseEvent) => {
    if (!isDrag || !scrollRef.current) return;
    scrollRef.current.scrollLeft = startX - e.pageX;
  };

  return (
    <section className='shadow-sm bg-tag-recomm px-8 py-6 rounded-lg flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden'>
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
        className={`flex flex-row flex-nowrap gap-4 w-full overflow-x-auto px-1 pb-1 scrollbar-hide ${
          isDrag ? "cursor-grabbing" : "cursor-grab"
        } active:cursor-grabbing transition-all`}
      >
        {[1, 2, 3].map((i) => (
          <div key={i} className='shrink-0 select-none pointer-events-none'>
            <div className='pointer-events-auto'>
              <ReviewCard
                title='작품 제목'
                posterUrl={defaultImg}
                date='2026-02-28'
                rating={4.5}
                isSimple={true}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
