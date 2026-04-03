import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";

export default function ReviewList() {
  return (
    <section className='flex flex-col gap-6 mt-12'>
      <div className='flex justify-between items-center'>
        <h2 className='text-[24px] font-bold text-main-gray'>
          총 <span className='text-blue-500'>50</span>개의 리뷰
        </h2>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2 text-dark-gray'>
            <ChevronLeft className='cursor-pointer hover:text-main-gray' />
            <span className='font-medium'>1 / 5</span>
            <ChevronRight className='cursor-pointer hover:text-main-gray' />
          </div>
          <select className='border border-light-gray p-2 rounded-lg text-sm outline-none bg-white cursor-pointer hover:border-main-gray transition-colors'>
            <option>별점순</option>
            <option>관람일자순</option>
            <option>작성일자순</option>
          </select>
        </div>
      </div>

      <div
        className='grid gap-6'
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <ReviewCard
            key={item}
            title='명탐정 코난: 세기말의 마술사'
            posterUrl='...'
            date='2026-04-03'
            rating={4.5}
            tags={[
              { name: "영화", type: "type" },
              { name: "애니메이션", type: "genre" },
            ]}
          />
        ))}
      </div>
    </section>
  );
}
