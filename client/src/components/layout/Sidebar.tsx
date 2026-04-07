import CarouselSection from "@/components/layout/CarouselSection";
import { Button } from "@/components/ui/button";
import { PenLine, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  rankingData: any;
  onCreateReview: () => void;
  isLoading: boolean;
}

/**
 * 메인화면 좌측 사이드바 컴포넌트
 * @param rankingData 순위 데이터 (메인화면 좌측 순위 캐러셀에 사용)
 * @param onCreateReview 리뷰 작성 버튼 클릭 시 호출되는 함수 (리뷰 작성 모달 오픈)
 * @param isLoading 순위 데이터 로딩 상태
 */
export default function Sidebar({
  rankingData,
  onCreateReview,
  isLoading,
}: SidebarProps) {
  const navigate = useNavigate();

  return (
    <aside className='flex-[1_1_25%] min-w-[270px] max-w-[360px] flex flex-col gap-6 transition-all duration-300'>
      <div className='grid grid-cols-2 gap-3'>
        <Button
          variant='secondary'
          className='p-4 h-16 rounded-lg flex items-center justify-center gap-1 md:gap-2 transition-all hover:bg-light-gray/50'
          onClick={() => navigate("/mypage")}
        >
          <User className='w-5 h-5 md:w-6 md:h-6 shrink-0' />
          <span className='text-[14px] md:text-[18px] font-bold truncate'>
            마이페이지
          </span>
        </Button>
        <Button
          className='p-4 h-16 rounded-lg flex items-center justify-center gap-1 md:gap-2 transition-all bg-main-gray hover:bg-black text-white'
          onClick={onCreateReview}
        >
          <PenLine className='w-5 h-5 md:w-6 md:h-6 shrink-0' />
          <span className='text-[14px] md:text-[18px] font-bold truncate'>
            리뷰 쓰기
          </span>
        </Button>
      </div>

      <CarouselSection data={rankingData} isLoading={isLoading} />
    </aside>
  );
}
