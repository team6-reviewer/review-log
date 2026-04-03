import { User, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import CarouselSection from "@/components/carousel/CarouselSection";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ rankingData }: { rankingData: any }) {
  const navigate = useNavigate();
  return (
    <aside className='flex-[1_1_25%] min-w-[270px] max-w-[360px] flex flex-col gap-6 transition-all duration-300'>
      <div className='grid grid-cols-2 gap-3'>
        <Button
          variant='secondary'
          className='p-4 h-16 rounded-lg flex items-center justify-center gap-1 md:gap-2 transition-all'
          onClick={() => navigate("/mypage")}
        >
          <User className='w-5 h-5 md:w-6 md:h-6 shrink-0' />
          <span className='text-[14px] md:text-[18px] font-bold truncate'>
            마이페이지
          </span>
        </Button>
        <Button className='p-4 h-16 rounded-lg flex items-center justify-center gap-1 md:gap-2 transition-all'>
          <PenLine className='w-5 h-5 md:w-6 md:h-6 shrink-0' />
          <span className='text-[14px] md:text-[18px] font-bold truncate'>
            리뷰 쓰기
          </span>
        </Button>
      </div>

      {rankingData && <CarouselSection data={rankingData} />}
    </aside>
  );
}
