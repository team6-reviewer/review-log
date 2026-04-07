import Tag from "@/components/Tag";
import { GENRE_TAGS, MOOD_TAGS } from "@/constants/tags";

interface TagFilterProps {
  selectedTags: string[];
  onTagClick: (tagname: string) => void;
}

/**
 * 메인화면, 마이페이지 리뷰 리스트에서 태그로 필터링할 때 사용하는 컴포넌트
 * @param selectedTags 현재 선택된 태그 배열
 * @param onTagClick 태그 클릭 시 호출되는 함수 (클릭한 태그의 tagname이 인자로 전달됨)
 */
export default function TagFilter({
  selectedTags,
  onTagClick,
}: TagFilterProps) {
  return (
    <div className='bg-white p-6 rounded-lg shadow-sm border border-light-gray flex flex-col gap-4'>
      <div className='flex items-center gap-4'>
        <span className='text-dark-gray shrink-0'>장르</span>
        <div className='flex flex-wrap gap-2'>
          {GENRE_TAGS.map((tag) => (
            <Tag
              key={tag.id}
              label={tag.tagname}
              type='genre'
              isSelected={selectedTags.includes(tag.tagname)}
              onClick={() => onTagClick(tag.tagname)}
            />
          ))}
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <span className='text-dark-gray shrink-0'>분위기</span>
        <div className='flex flex-wrap gap-2'>
          {MOOD_TAGS.map((tag) => (
            <Tag
              key={tag.id}
              label={tag.tagname}
              type='mood'
              isSelected={selectedTags.includes(tag.tagname)}
              onClick={() => onTagClick(tag.tagname)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
