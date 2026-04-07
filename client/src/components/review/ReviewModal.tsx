import { useEffect, useState } from "react";
import SearchStep from "./SearchStep";
import WriteStep from "./WriteStep";

interface ReviewModalProps {
  mode: "create" | "edit" | "view";
  reviewId?: number;
  onClose: () => void;
}

/**
 * 리뷰 작성/수정/조회 모달 컴포넌트
 * @param mode 모달 모드 ("create": 작성, "edit": 수정, "view": 조회)
 * @param reviewId 수정/조회할 리뷰 ID (작성 모드에서는 필요 없음)
 * @param onClose 모달 닫기 함수
 */
export default function ReviewModal({
  mode,
  reviewId,
  onClose,
}: ReviewModalProps) {
  // 작성 모드일 때만 검색(1)부터 시작, 나머지는 바로 작성/조회(2)
  const [step, setStep] = useState(mode === "create" ? 1 : 2);
  const [selectedWork, setSelectedWork] = useState<any>(null);

  // 배경 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    // 스크롤바 너비 계산 (현재 창 너비 - 실제 문서 너비)
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // 모달 열려있으면 스크롤바 제거
    document.body.style.overflow = "hidden";
    // 스크롤바가 사라진 만큼 여백을 채워서 UI 움직임 방지
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // 모달 닫히면 원상복구
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, []);

  return (
    <div
      className='fixed inset-0 z-[100] bg-[#00000066] backdrop-blur-[2px] flex items-center justify-center p-6'
      onClick={handleOverlayClick}
    >
      <div className='bg-white p-5 w-[80%] max-w-[900px] rounded-lg h-[80%] shadow-2xl flex flex-col relative animate-in fade-in zoom-in duration-300'>
        {step === 1 && mode === "create" ? (
          <SearchStep
            onNext={(work: any) => {
              setSelectedWork(work);
              setStep(2);
            }}
            onClose={onClose}
          />
        ) : (
          <WriteStep
            mode={mode}
            reviewId={reviewId}
            selectedWork={selectedWork} // 작품 검색(SearchStep)에서 선택한 데이터 전달
            onBack={() => setStep(1)}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
