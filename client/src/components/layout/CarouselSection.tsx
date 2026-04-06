import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Tag from "@/components/Tag";
import defaultImg from "@/assets/defaultImg.png";

// 추후 수정
interface RankingData {
  nowPlaying: {
    id: number;
    title: string;
    posterPath: string;
  }[];
  bestSellers: {
    id: number;
    title: string;
    posterPath: string;
  }[];
  mostReviewed: any[];
  popularTags: any[];
}

export default function CarouselSection({ data }: { data: RankingData }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      title: "현재 상영작 순위",
      items: data.nowPlaying,
      bg: "bg-rank-now",
      isTag: false,
    },
    {
      title: "현재 베스트셀러 순위",
      items: data.bestSellers,
      bg: "bg-rank-best",
      isTag: false,
    },
    {
      title: "리뷰 많은 작품 순위",
      items: data.mostReviewed,
      bg: "bg-rank-review",
      isTag: false,
    },
    {
      title: "많이 쓰인 태그 순위",
      items: data.popularTags,
      bg: "bg-rank-tag",
      isTag: true,
    },
  ];

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
  }, [api, onSelect]);

  const currentBg = slides[current].bg;

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
          <CarouselContent className='h-full ml-0 flex items-stretch'>
            {slides.map((slide, sIdx) => (
              <CarouselItem
                key={sIdx}
                className='h-full min-h-full pl-0 p-[5%] flex flex-col gap-2'
              >
                <h2 className={"mt-2 text-[28px] font-bold text-white"}>
                  {slide.title}
                </h2>

                <div className='h-full min-h-0 flex-1 flex flex-col gap-4 overflow-hidden'>
                  {slide.isTag ? (
                    /* 태그 레이아웃: 2열 그리드 */
                    <div className='flex-1 flex flex-col justify-between gap-[clamp(1rem,3vh,3rem)]'>
                      {slide.items.length === 0 ? (
                        <p className='text-white text-center mt-8'>
                          데이터가 없습니다.
                        </p>
                      ) : (
                        slide.items?.slice(0, 5).map((tag, tIdx) => (
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
                    /* 작품 레이아웃: 5개 배치 */
                    <div className='flex flex-col gap-3'>
                      {slide.items.length === 0 ? (
                        <p className='text-white text-center mt-8'>
                          데이터가 없습니다.
                        </p>
                      ) : (
                        slide.items?.slice(0, 5).map((movie, mIdx) => (
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
