import Tag from "@/components/Tag";
import { GENRE_TAGS, MOOD_TAGS } from "@/constants/tags";

interface TagFilterProps {
  selectedTags: string[];
  onTagClick: (tagname: string) => void;
}

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
