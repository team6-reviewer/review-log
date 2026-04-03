import Tag from "@/components/Tag";
import ReviewCard from "@/components/ReviewCard";

export default function RecommendSection() {
  return (
    <section className='bg-tag-recomm px-8 py-6 rounded-[30px] flex flex-row items-center justify-between gap-8 relative overflow-hidden'>
      <div className='flex flex-col gap-4 z-10 shrink-0 min-w-fit'>
        <h2 className='text-[clamp(20px,3vw,32px)] font-bold leading-tight whitespace-nowrap text-main-gray'>
          내가 재미있게 본 <br />
          <div className='flex items-center gap-2 mt-1'>
            <Tag label='감동적인' type='mood' isSelected={false} />
            <span>다른 작품 리뷰</span>
          </div>
        </h2>
      </div>
      <div className='flex flex-row flex-nowrap gap-4 w-full overflow-x-auto pb-1 scrollbar-hide'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='shrink-0'>
            <ReviewCard
              title='에브리씽...'
              posterUrl='...'
              date='2026-02-28'
              rating={4.5}
              isSimple={true}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
