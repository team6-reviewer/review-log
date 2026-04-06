import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import Tag from "@/components/Tag";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import API from "@/services/api";
import { GENRE_TAGS, MOOD_TAGS } from "@/constants/tags";
import { useAuthStore } from "@/stores/useAuthStore";

export default function WriteStep({
  mode,
  reviewId,
  selectedWork,
  onBack,
  onClose,
}: any) {
  const queryClient = useQueryClient();
  const [currentMode, setCurrentMode] = useState(mode);
  const loginUserId = useAuthStore((state) => state.userId);

  const [formData, setFormData] = useState({
    title: "",
    score: 0.0,
    content: "",
    watch_date: "",
    write_date: "",
    type: "movie",
    posterPath: "",
    tags: [] as string[],
  });

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

  const mutation = useMutation({
    mutationFn: (data: any) =>
      currentMode === "edit"
        ? API.put(`/reviews/${reviewId}`, data)
        : API.post("/reviews", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      onClose();
    },
  });

  const validateAndSubmit = () => {
    const newErrors = {
      watch_date: !formData.watch_date,
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

  const isView = currentMode === "view";

  return (
    <div className='rounded-lg p-12 flex flex-col items-center gap-10 bg-white max-h-[90vh] overflow-y-auto scrollbar-hide'>
      <div className='flex flex-row gap-12 items-start'>
        <div className='w-[280px] shrink-0 aspect-[3/4.2] rounded-[24px] overflow-hidden shadow-md'>
          <img
            src={formData.posterPath}
            className='w-full h-full object-cover'
            alt='poster'
          />
        </div>

        <div className='flex-1 flex flex-col gap-6'>
          <h2 className='text-[36px] font-bold text-main-gray leading-tight'>
            {formData.title}
          </h2>

          {/* 날짜/별점/태그 리스트 (작성/수정 모드 UI) */}
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
                  관람일자를 입력해 주세요.
                </p>
              )}
            </div>

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
                    <span className='text-xs text-dark-gray text-nowrap'>
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
                    <span className='text-xs text-dark-gray text-nowrap'>
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
            <button className='text-destructive text-sm font-medium underline'>
              리뷰 삭제
            </button>
          )}
          {isView && !detailData?.isMine && (
            <span className='text-main-gray text-sm font-medium'>
              by. 닉네임
            </span>
          )}
        </div>
        {!isView && !!errors.content && (
          <p className='text-[14px] text-destructive'>
            감상평을 작성해 주세요.
          </p>
        )}
      </div>

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
