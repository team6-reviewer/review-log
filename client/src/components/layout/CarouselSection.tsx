import defaultImg from "@/assets/defaultImg.png";
import Tag from "@/components/Tag";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { RankingData, RankingItem, RankingTag } from "@/types/ranking";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";

/**
 * 순위 캐러셀 섹션 컴포넌트
 * @param data 순위 데이터 객체 (현재 상영작, 베스트셀러, 리뷰 많은 작품, 인기 태그)
 * @param isLoading 로딩 상태
 */
export default function CarouselSection({
  data,
  isLoading,
}: {
  data: RankingData;
  isLoading: boolean;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // 캐러셀에 렌더링할 슬라이드 데이터 구성
  const slides: {
    title: string;
    items: RankingItem[] | RankingTag[];
    bg: string;
    isTag: boolean;
  }[] = [
    {
      title: "현재 상영작 순위",
      items: data.nowPlaying as RankingItem[],
      bg: "bg-rank-now",
      isTag: false,
    },
    {
      title: "현재 베스트셀러 순위",
      items: data.bestSellers as RankingItem[],
      bg: "bg-rank-best",
      isTag: false,
    },
    {
      title: "리뷰 많은 작품 순위",
      items: data.mostReviewed as RankingItem[],
      bg: "bg-rank-review",
      isTag: false,
    },
    {
      title: "많이 쓰인 태그 순위",
      items: data.popularTags as RankingTag[],
      bg: "bg-rank-tag",
      isTag: true,
    },
  ];

  // 캐러셀에서 선택된 슬라이드 인덱스 업데이트
  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  // 캐러셀 API가 준비되면 선택 이벤트 리스너 등록
  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
  }, [api, onSelect]);

  // 현재 슬라이드에 따른 배경 클래스
  const currentBg = slides[current].bg;

  // 로딩 중일 때 보여줄 스켈레톤
  if (isLoading) {
    return (
      <div className='w-full h-full max-w-[360px] aspect-[4/5.2] relative mx-auto rounded-lg shadow-sm overflow-hidden bg-gray-200 animate-pulse'>
        <div className='h-full p-[5%] flex flex-col gap-6'>
          {/* 타이틀 스켈레톤 */}
          <div className='mt-4 h-9 w-2/3 bg-gray-300 rounded-md' />

          {/* 리스트 아이템 스켈레톤 (5개) */}
          <div className='flex flex-col gap-4 mt-2'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex items-center gap-3'>
                {/* 순위 숫자 자리 */}
                <div className='w-6 h-8 bg-gray-300 rounded' />
                {/* 포스터/태그 이미지 자리 */}
                <div className='w-12 aspect-[3/4] bg-gray-300 rounded-md shrink-0' />
                {/* 텍스트 자리 */}
                <div className='h-4 bg-gray-300 rounded flex-1' />
              </div>
            ))}
          </div>
        </div>

        {/* 하단 도트( 스켈레톤 */}
        <div className='absolute bottom-4 left-0 w-full flex justify-center gap-2'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='w-2 h-2 rounded-full bg-gray-300' />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-full max-w-[360px] aspect-[4/5.2] relative mx-auto rounded-lg shadow-sm overflow-hidden'>
      <div
        className={`w-full h-full overflow-y-auto scrollbar-hide transition-colors duration-500 ${currentBg}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <Carousel
          setApi={setApi}
          plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
          opts={{ loop: true }}
          className='w-full h-full'
        >
          <CarouselContent className='h-full ml-0 flex items-stretch cursor-grab'>
            {slides.map((slide, sIdx) => (
              <CarouselItem
                key={sIdx}
                className='h-full min-h-full pl-0 p-[5%] pt-3 flex flex-col gap-2'
              >
                <h2 className={"text-[28px] font-bold text-white"}>
                  {slide.title}
                </h2>

                <div className='h-full min-h-0 flex-1 flex flex-col gap-4 overflow-hidden'>
                  {slide.isTag ? (
                    /* 태그형 순위 레이아웃 */
                    <div className='flex-1 flex flex-col justify-between gap-[clamp(1rem,3vh,3rem)]'>
                      {slide.items.length === 0 ? (
                        <p className='text-white text-center mt-8'>
                          데이터가 없습니다.
                        </p>
                      ) : (
                        (slide.items as RankingTag[])
                          ?.slice(0, 5)
                          .map((tag, tIdx) => (
                            <div
                              key={tIdx}
                              className='flex items-center gap-2 group'
                            >
                              <span className='text-[24px] font-bold text-white min-w-[25px]'>
                                {tIdx + 1}.
                              </span>
                              <Tag
                                label={tag.name}
                                type={tag.type}
                                isSelected={false}
                              />
                            </div>
                          ))
                      )}
                    </div>
                  ) : (
                    /* 작품형 순위 레이아웃 */
                    <div className='flex flex-col gap-3'>
                      {slide.items.length === 0 ? (
                        <p className='text-white text-center mt-8'>
                          데이터가 없습니다.
                        </p>
                      ) : (
                        (slide.items as RankingItem[])
                          ?.slice(0, 5)
                          .map((movie, mIdx) => (
                            <div key={mIdx} className='flex items-center gap-2'>
                              <span className='text-[24px] font-bold text-white min-w-[25px]'>
                                {mIdx + 1}.
                              </span>
                              <div className='w-12 aspect-[3/4] rounded-md overflow-hidden shadow-sm bg-black/5 flex-shrink-0'>
                                <img
                                  src={movie.posterPath || defaultImg}
                                  alt={movie.title}
                                  className='w-full h-full object-cover'
                                  onError={(e) => {
                                    // 데이터는 있는데 URL이 깨졌거나 이미지 서버 에러일 때
                                    (e.currentTarget as HTMLImageElement).src =
                                      defaultImg;
                                  }}
                                  draggable={false}
                                />
                              </div>
                              <p className='flex-1 text-[14px] font-semibold text-white line-clamp-1 pr-2 leading-tight'>
                                {movie.title}
                              </p>
                            </div>
                          ))
                      )}
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Dots */}
      <div className='absolute bottom-3 left-0 w-full flex justify-center gap-2 z-20 pb-1'>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              current === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
