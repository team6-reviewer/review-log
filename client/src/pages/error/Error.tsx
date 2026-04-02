import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error() {
  const navigate = useNavigate();

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background px-4'>
      <div className='flex gap-10 w-full max-w-[500px] flex-col items-center justify-center rounded-[10px] border border-dark-gray bg-white p-16 shadow-sm'>
        {/* 아이콘과 텍스트 섹션 */}
        <div className='flex items-center justify-center gap-4'>
          <AlertCircle
            className='w-16 h-16 text-destructive'
            strokeWidth={2.5}
          />
          <h2 className='text-[28px] font-bold text-main-gray tracking-tight'>
            잘못된 경로입니다.
          </h2>
        </div>

        {/* 뒤로가기 버튼 */}
        <Button
          onClick={() => navigate(-1)} // 이전 페이지로 이동
          variant='outline'
          className='h-10 px-8 border-dark-gray text-main-gray hover:bg-light-gray rounded-lg text-[14px]'
        >
          뒤로가기
        </Button>
      </div>
    </div>
  );
}
