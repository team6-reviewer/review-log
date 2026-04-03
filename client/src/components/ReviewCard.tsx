import { MoreHorizontal, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Tag from "@/components/Tag";

interface ReviewCardProps {
  title: string;
  posterUrl: string;
  date: string;
  rating: number;
  tags?: { name: string; type: "type" | "genre" | "mood" }[];
  onDelete?: () => void;
  onEdit?: () => void;
  onClick?: () => void;
  isSimple?: boolean; // 간단한 카드 여부
}

export default function ReviewCard({
  title,
  posterUrl,
  date,
  rating,
  tags,
  onDelete,
  onEdit,
  onClick,
  isSimple = false,
}: ReviewCardProps) {
  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating); // 꽉 찬 별 개수
    const hasHalfStar = rating % 1 !== 0; // 반 별 유무 (0.5 단위)

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // 꽉 찬 별
        stars.push(
          <Star
            key={i}
            className='w-3.5 h-3.5 fill-star-yellow text-star-yellow'
          />,
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        // 반 별 (정확히 다음 순서에 하나만 렌더링)
        stars.push(
          <div key={i} className='relative w-3.5 h-3.5'>
            {/* 배경: 빈 별 (회색) */}
            <Star className='absolute inset-0 w-full h-full fill-light-gray text-light-gray' />

            {/* 위층: 꽉 찬 별 (노란색) */}
            <div
              className='absolute inset-0 w-full h-full z-10'
              style={{ clipPath: "inset(0 50% 0 0)" }}
            >
              {/* 오른쪽 50%를 도려냄 */}
              <Star className='w-full h-full fill-star-yellow text-star-yellow' />
            </div>
          </div>,
        );
      } else {
        // 나머지 빈 별
        stars.push(
          <Star
            key={i}
            className='w-3.5 h-3.5 fill-light-gray text-light-gray'
          />,
        );
      }
    }
    return stars;
  };

  const width = isSimple ? "w-[200px]" : "w-[240px]";

  return (
    <div
      className={`${width} flex flex-col gap-2 bg-white rounded-[20px] overflow-hidden shadow-md p-4 group cursor-pointer`}
      onClick={onClick}
    >
      {!isSimple && (
        <div className='flex justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger className='hover:bg-light-gray transition-colors outline-none border-none'>
              <MoreHorizontal className='w-5 h-5 text-dark-gray' />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='bg-white border-none shadow-md min-w-[100px] py-1'
            >
              <DropdownMenuItem
                onClick={onEdit}
                className='text-[13px] text-main-gray cursor-pointer focus:bg-light-gray focus:text-main-gray py-2'
              >
                리뷰 수정
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className='text-[13px] text-destructive cursor-pointer focus:bg-light-gray focus:text-destructive py-2'
              >
                리뷰 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* 포스터 이미지 */}
      <div className='w-full aspect-[4/3] overflow-hidden'>
        <img
          src={posterUrl}
          alt={title}
          className='w-full h-full object-cover'
        />
      </div>

      {/* 정보 섹션 */}
      <div className='flex flex-col gap-2 px-0.5'>
        <h3 className='text-[20px] font-bold text-movie-title truncate leading-[1.2]'>
          {title}
        </h3>

        <div className='flex justify-between items-center'>
          <span className='text-[12px] text-dark-gray'>{date}</span>
          <div className='flex items-center gap-0.5'>{renderStars(rating)}</div>
        </div>

        {!isSimple && (
          <div className='flex gap-1.5 flex-wrap'>
            {tags?.map((tag) => (
              <Tag
                key={tag.name}
                label={tag.name}
                type={tag.type}
                isSelected={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
