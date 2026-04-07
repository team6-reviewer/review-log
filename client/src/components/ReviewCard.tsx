import defaultImg from "@/assets/defaultImg.png";
import Tag from "@/components/Tag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Star } from "lucide-react";

interface ReviewCardProps {
  title: string;
  posterUrl: string;
  date: string;
  rating: number;
  tags?: { name: string; type: "type" | "genre" | "mood" }[];
  isMine?: boolean; // 내가 쓴 글인지 여부 추가
  onDelete?: (e: React.MouseEvent) => void; // 이벤트 전파 방지를 위해 e 추가
  onEdit?: (e: React.MouseEvent) => void;
  onClick?: () => void;
  isSimple?: boolean;
}

/**
 * 리뷰 카드 컴포넌트
 * @param title 작품 제목
 * @param posterUrl 포스터 이미지 URL
 * @param date 작성일자
 * @param rating 별점
 * @param tags 태그 목록
 * @param isMine 내가 쓴 글인지 여부
 * @param onDelete 삭제 함수
 * @param onEdit 수정 함수
 * @param onClick 클릭 함수
 * @param isSimple 간단한 모드 여부 (true면 태그 숨김, 카드 너비 축소)
 * @returns
 */
export default function ReviewCard({
  title,
  posterUrl,
  date,
  rating,
  tags,
  isMine = false, // 기본값 false
  onDelete,
  onEdit,
  onClick,
  isSimple = false,
}: ReviewCardProps) {
  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className='w-3.5 h-3.5 fill-star-yellow text-star-yellow'
          />,
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className='relative w-3.5 h-3.5'>
            <Star className='absolute inset-0 w-full h-full fill-light-gray text-light-gray' />
            <div
              className='absolute inset-0 w-full h-full z-10'
              style={{ clipPath: "inset(0 50% 0 0)" }}
            >
              <Star className='w-full h-full fill-star-yellow text-star-yellow' />
            </div>
          </div>,
        );
      } else {
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

  // isSimple이 true면 너비 200px, false면 240px
  const width = isSimple ? "w-[200px]" : "w-[240px]";

  return (
    <div
      className={`${width} flex flex-col gap-2 bg-white rounded-lg overflow-hidden shadow-md p-4 group cursor-pointer hover:shadow-lg transition-shadow`}
      onClick={onClick}
    >
      {/* isSimple이 아니고 + 내 리뷰일 때만 드롭다운 노출 */}
      {!isSimple && !!isMine && (
        <div className='flex justify-end' onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger className='hover:bg-light-gray transition-colors outline-none border-none rounded-full p-1'>
              <MoreHorizontal className='w-5 h-5 text-dark-gray' />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='bg-white border-none shadow-md min-w-[100px] py-1'
            >
              <DropdownMenuItem
                onClick={onEdit}
                className='text-[14px] text-black cursor-pointer focus:bg-light-gray focus:text-main-gray py-2'
              >
                리뷰 수정
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className='text-[14px] text-destructive cursor-pointer focus:bg-light-gray focus:text-destructive py-2'
              >
                리뷰 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* 포스터 이미지 */}
      <div className='w-full aspect-[4/3] overflow-hidden rounded-sm'>
        <img
          src={posterUrl || defaultImg}
          alt={title}
          className='w-full h-full object-cover'
          onError={(e) => {
            // 데이터는 있는데 URL이 깨졌거나 이미지 서버 에러일 때
            (e.currentTarget as HTMLImageElement).src = defaultImg;
          }}
        />
      </div>

      {/* 정보 섹션 */}
      <div className='flex flex-col gap-2 px-0.5 mt-1'>
        <h3 className='text-[20px] font-bold text-movie-title truncate leading-[1.2]'>
          {title}
        </h3>

        <div className='flex justify-between items-center'>
          <span className='text-[12px] text-dark-gray'>{date}</span>
          <div className='flex items-center gap-0.5'>{renderStars(rating)}</div>
        </div>

        {!isSimple && (
          <div className='flex gap-1.5 flex-wrap mt-1'>
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
