import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Tag from "@/components/Tag";

// 추후 수정
interface RankingData {
  nowPlaying: any[];
  bestSellers: any[];
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
      title: "가장 리뷰 많은 작품 순위",
      items: data.mostReviewed,
      bg: "bg-rank-review",
      isTag: false,
    },
    {
      title: "가장 많이 쓰인 태그 순위",
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
    <div
      className={`flex-shrink-0 w-full max-w-[360px] aspect-[580/340] relative mx-auto rounded-[24px] shadow-sm transition-colors duration-500 overflow-hidden ${currentBg}`}
    >
      <Carousel
        setApi={setApi}
        plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
        opts={{ loop: true }}
        className='w-full h-full'
      >
        <CarouselContent className='h-full ml-0'>
          {slides.map((slide, sIdx) => (
            <CarouselItem
              key={sIdx}
              className='h-full pl-0 p-[5%] flex flex-col justify-start'
            >
              <h2 className={"text-[24px] font-bold mb-2 text-white"}>
                {slide.title}
              </h2>

              <div className='flex-1 w-full flex items-center'>
                {slide.isTag ? (
                  /* 태그 레이아웃: 2열 그리드 */
                  <div className='w-full grid grid-cols-2 gap-y-2 justify-between'>
                    {slide.items.slice(0, 5).map((tag, tIdx) => (
                      <div key={tIdx} className='flex items-center gap-4'>
                        <span className='text-[24px] font-bold text-white min-w-[25px]'>
                          {tIdx + 1}.
                        </span>
                        <Tag
                          label={tag.name}
                          type={tag.type}
                          isSelected={false}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  /* 작품 레이아웃: 5개 배치 */
                  <div className='grid grid-cols-5 gap-3'>
                    {slide.items.slice(0, 5).map((movie, mIdx) => (
                      <div key={mIdx} className='flex flex-col gap-2'>
                        <div className='aspect-[3/4.2] rounded-md overflow-hidden shadow-sm bg-black/5'>
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <p className='h-[2.6em] line-clamp-2 text-[11px] font-medium opacity-90 text-white leading-tight'>
                          {movie.title}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots */}
      <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2'>
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
