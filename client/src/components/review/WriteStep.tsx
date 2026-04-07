import defaultImg from "@/assets/defaultImg.png";
import Tag from "@/components/Tag";
import { Button } from "@/components/ui/button";
import { GENRE_TAGS, MOOD_TAGS } from "@/constants/tags";
import { cn } from "@/lib/utils";
import API from "@/services/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface WriteStepProps {
  mode: "create" | "edit" | "view";
  reviewId?: number;
  selectedWork?: {
    title: string;
    posterPath: string;
    contentType: "movie" | "book";
  }; // SearchStep에서 선택한 작품 데이터 (작성 모드일 때만 존재)
  onBack: () => void;
  onClose: () => void;
}

/**
 * 리뷰 작성/수정/조회 단계 컴포넌트
 * - 작성 모드: SearchStep에서 작품 선택 후 WriteStep으로 넘어와서 작성
 * - 수정 모드: 기존 리뷰 데이터 불러와서 수정
 * - 조회 모드: 기존 리뷰 데이터 불러와서 조회 (수정/삭제는 본인 리뷰일 때만 가능)
 * @param mode 현재 모드 ("create": 작성, "edit": 수정, "view": 조회)
 * @param reviewId 수정/조회할 리뷰 ID (작성 모드에서는 필요 없음)
 * @param selectedWork SearchStep에서 선택한 작품 데이터 (작성 모드일 때만 존재)
 * @param onBack 작성 모드에서 SearchStep로 돌아가기 위한 함수
 * @param onClose 모달 닫기 함수
 * @returns
 */
export default function WriteStep({
  mode,
  reviewId,
  selectedWork,
  onBack,
  onClose,
}: WriteStepProps) {
  const queryClient = useQueryClient(); // React Query 쿼리 클라이언트 객체
  const [currentMode, setCurrentMode] = useState(mode);
  const loginUserId = useAuthStore((state) => state.userId); // 로그인한 사용자 ID (리뷰 조회 시 본인 리뷰 여부 판단)

  const today = new Date().toISOString().split("T")[0]; // yyyy-MM-dd 형식 오늘 날짜

  // 폼데이터 초기화
  const [formData, setFormData] = useState({
    title: "",
    score: 0.0,
    content: "",
    watch_date: today,
    write_date: today,
    type: "movie",
    posterPath: "",
    tags: [] as string[],
  });

  // 에러 여부 초기화
  const [errors, setErrors] = useState({
    watch_date: false,
    tags: false,
    content: false,
  });

  // 상세 데이터 로드 (수정/조회 모드)
  const { data: detailData } = useQuery({
    queryKey: ["review", reviewId, loginUserId],
    queryFn: () =>
      API.get(`/reviews/${reviewId}`, {
        params: { loginUserId }, // 쿼리 파라미터로 로그인한 사용자 ID를 같이 보냄
      }).then((res) => res.data),
    enabled: !!reviewId,
  });

  // 데이터 매핑 (신규 작성은 selectedWork에서, 수정/조회는 detailData에서)
  useEffect(() => {
    if (currentMode === "create" && selectedWork) {
      setFormData((prev) => ({
        ...prev,
        title: selectedWork.title,
        type: selectedWork.contentType,
        posterPath: selectedWork.posterPath,
      }));
    } else if (detailData) {
      // 백엔드에서 문자열로 온 태그를 배열로 쪼갬
      const backendTags = detailData.tags ? detailData.tags.split(", ") : [];

      setFormData({
        title: detailData.title,
        score: Number(detailData.score),
        content: detailData.content,
        write_date: detailData.write_date.split("T")[0],
        watch_date: detailData.watch_date.split("T")[0],
        type: detailData.type,
        posterPath: detailData.content_image,
        tags: backendTags,
      });
    }
  }, [selectedWork, detailData, currentMode]);

  // 작성/수정 Mutation
  const mutation = useMutation({
    mutationFn: (data: any) =>
      currentMode === "edit"
        ? API.put(`/reviews/${reviewId}`, data)
        : API.post("/reviews", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      if (currentMode === "edit") {
        // 수정 모드일 때는 상세 데이터를 다시 불러오고 조회 모드로 변경
        queryClient.invalidateQueries({
          queryKey: ["review", reviewId, loginUserId],
        });
        setCurrentMode("view");
        alert("수정이 완료되었습니다.");
      } else {
        // 작성 모드일 때는 닫기
        alert("리뷰가 등록되었습니다.");
        onClose();
      }
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;

      if (
        error.response?.status === 409 ||
        serverMessage?.includes("리뷰 중복 작성")
      ) {
        // 1작품 1리뷰 위반 시
        alert("이미 리뷰를 작성한 작품입니다.");
      } else {
        // 기타 서버 에러
        alert(serverMessage || "리뷰 저장 중 오류가 발생했습니다.");
      }
    },
  });

  // 폼 검증 및 제출 함수
  const validateAndSubmit = () => {
    const newErrors = {
      watch_date: !formData.watch_date || formData.watch_date > today,
      tags: formData.tags.length === 0,
      content: !formData.content.trim(),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((v) => v)) return;

    const { posterPath, ...rest } = formData;
    mutation.mutate({
      ...rest,
      content_image: posterPath,
      genre_tags: formData.tags.filter((t) =>
        GENRE_TAGS.some((g) => g.tagname === t),
      ),
      mood_tags: formData.tags.filter((t) =>
        MOOD_TAGS.some((m) => m.tagname === t),
      ),
    });
  };

  // 조회 모드 여부
  const isView = currentMode === "view";

  // 삭제 Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => API.delete(`/reviews/${id}`),
    onSuccess: () => {
      // 리스트 데이터 무효화 (홈, 마이페이지 등)
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      alert("리뷰가 삭제되었습니다.");
      onClose(); // 삭제 성공 시 모달 닫기
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "삭제 중 오류가 발생했습니다.");
    },
  });

  // 삭제 핸들러 함수
  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate(reviewId as number);
    }
  };
  return (
    <div className='rounded-lg p-12 flex flex-col items-center gap-10 bg-white max-h-[90vh] overflow-y-auto scrollbar-hide'>
      <div className='flex flex-row gap-12 items-start'>
        <div className='w-[280px] shrink-0 aspect-[3/4.2] rounded-[24px] overflow-hidden shadow-md'>
          <img
            src={formData.posterPath || defaultImg}
            className='w-full h-full object-cover'
            alt='poster'
            onError={(e) => {
              // 데이터는 있는데 URL이 깨졌거나 이미지 서버 에러일 때
              (e.currentTarget as HTMLImageElement).src = defaultImg;
            }}
          />
        </div>

        <div className='flex-1 flex flex-col gap-6'>
          <h2 className='text-[36px] font-bold text-main-gray leading-tight'>
            {formData.title}
          </h2>

          {/* 날짜 */}
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <span className='text-[14px] text-dark-gray'>관람일자</span>
                {isView ? (
                  <span>{formData.watch_date}</span>
                ) : (
                  <input
                    type='date'
                    placeholder='yyyy-MM-dd'
                    value={formData.watch_date}
                    max={today}
                    onChange={(e) => {
                      setFormData({ ...formData, watch_date: e.target.value });
                      setErrors({ ...errors, watch_date: false });
                    }}
                    className='p-1 rounded-lg border border-main-gray focus:border-black bg-background w-40'
                  />
                )}
              </div>
              {isView && (
                <div className='flex items-center gap-2'>
                  <span className='text-[14px] text-dark-gray'>작성일자</span>
                  <span>{formData.write_date}</span>
                </div>
              )}
              {!isView && !!errors.watch_date && (
                <p className='text-[14px] text-destructive'>
                  관람일자를 올바르게 입력해 주세요.
                </p>
              )}
            </div>

            {/* 별점 */}
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-3'>
                <div className='flex'>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "relative w-10 h-10",
                        !isView ? "cursor-pointer" : "cursor-default",
                      )}
                      onClick={(e) => {
                        if (isView) return;
                        const { left, width } =
                          e.currentTarget.getBoundingClientRect();
                        const isHalf = e.clientX - left < width / 2;
                        const score = i + (isHalf ? 0.5 : 1);

                        setFormData({ ...formData, score });
                        setErrors((prev) => ({ ...prev, score: false }));
                      }}
                    >
                      <Star className='absolute inset-0 w-full h-full fill-light-gray text-light-gray' />
                      {formData.score > i && (
                        <div
                          className='absolute inset-0 w-full h-full z-10 overflow-hidden'
                          style={{
                            clipPath:
                              formData.score === i + 0.5
                                ? "inset(0 50% 0 0)"
                                : "inset(0 0 0 0)",
                          }}
                        >
                          <Star className='w-full h-full fill-star-yellow text-star-yellow' />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <span className='text-[24px] font-bold text-main-gray ml-2'>
                  {formData.score.toFixed(1)}
                </span>
                <span className='text-light-gray font-normal text-lg'>
                  / 5.0
                </span>
              </div>
            </div>

            {/* 태그 */}
            <div className='flex flex-col gap-4'>
              <span>
                <Tag
                  label={formData.type === "movie" ? "영화" : "도서"}
                  type='type'
                />
              </span>
              {!isView ? (
                <>
                  <div className='flex gap-4'>
                    <span className='mt-2 text-sm text-dark-gray text-nowrap'>
                      장르
                    </span>
                    <div className='flex flex-wrap gap-2'>
                      {GENRE_TAGS.map((t) => (
                        <Tag
                          key={t.id}
                          label={t.tagname}
                          type='genre'
                          isSelected={formData.tags.includes(t.tagname)}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tags: formData.tags.includes(t.tagname)
                                ? formData.tags.filter((x) => x !== t.tagname)
                                : [...formData.tags, t.tagname],
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div className='flex gap-4'>
                    <span className='mt-2 text-sm text-dark-gray text-nowrap'>
                      분위기
                    </span>
                    <div className='flex flex-wrap gap-2'>
                      {MOOD_TAGS.map((t) => (
                        <Tag
                          key={t.id}
                          label={t.tagname}
                          type='mood'
                          isSelected={formData.tags.includes(t.tagname)}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tags: formData.tags.includes(t.tagname)
                                ? formData.tags.filter((x) => x !== t.tagname)
                                : [...formData.tags, t.tagname],
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className='flex gap-2 flex-wrap'>
                  {formData.tags.map((t) => (
                    <Tag
                      key={t}
                      label={t}
                      type={
                        GENRE_TAGS.some((g) => g.tagname === t)
                          ? "genre"
                          : "mood"
                      }
                      isSelected={false}
                    />
                  ))}
                </div>
              )}
              {!isView && !!errors.tags && (
                <p className='text-[14px] text-destructive'>
                  태그를 한 개 이상 선택해 주세요.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 감상평 */}
      <div className='flex flex-col gap-2 w-full'>
        <textarea
          readOnly={isView}
          value={formData.content}
          onChange={(e) => {
            setFormData({ ...formData, content: e.target.value });
            setErrors({ ...errors, content: false });
          }}
          placeholder='이 작품은 당신에게 어떤 의미를 주었나요?'
          className={cn(
            "w-full p-8 rounded-lg border border-main-gray bg-background leading-relaxed resize-none",
          )}
        />
        <div className='flex justify-end'>
          {isView && !!detailData?.isMine && (
            <button
              onClick={handleDelete}
              className='text-destructive text-sm font-medium underline'
            >
              리뷰 삭제
            </button>
          )}
          {isView && !detailData?.isMine && (
            <span className='text-main-gray text-sm font-medium'>
              by. {detailData?.nickname}
            </span>
          )}
        </div>
        {!isView && !!errors.content && (
          <p className='text-[14px] text-destructive'>
            감상평을 작성해 주세요.
          </p>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className='flex justify-center'>
        <div className='flex justify-between gap-4'>
          {isView ? (
            <>
              {!!detailData?.isMine && (
                <Button
                  onClick={() => setCurrentMode("edit")}
                  variant='secondary'
                  className='w-[152px]'
                >
                  수정하기
                </Button>
              )}
              <Button onClick={onClose} variant='primary' className='w-[152px]'>
                닫기
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={
                  currentMode === "edit" ? () => setCurrentMode("view") : onBack
                }
                variant='secondary'
                className='w-[152px]'
              >
                {currentMode === "edit" ? "수정취소" : "뒤로가기"}
              </Button>
              <Button
                onClick={validateAndSubmit}
                variant='primary'
                className='w-[152px]'
              >
                {currentMode === "edit" ? "수정완료" : "작성완료"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
