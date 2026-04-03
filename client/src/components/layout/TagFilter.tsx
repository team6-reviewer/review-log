import Tag from "@/components/Tag";

const GENRES = ["판타지", "로맨스", "스릴러", "드라마"];
const MOODS = ["감동적인", "잔잔한", "몽환적인", "유쾌한"];

export default function TagFilter() {
  return (
    <div className='bg-white p-6 rounded-[20px] shadow-sm border border-light-gray flex flex-col gap-4'>
      <div className='flex items-center gap-4'>
        <span className='text-dark-gray font-bold shrink-0'>장르</span>
        <div className='flex flex-wrap gap-2'>
          {GENRES.map((t) => (
            <Tag key={t} label={t} type='genre' />
          ))}
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <span className='text-dark-gray font-bold shrink-0'>분위기</span>
        <div className='flex flex-wrap gap-2'>
          {MOODS.map((t) => (
            <Tag key={t} label={t} type='mood' />
          ))}
        </div>
      </div>
    </div>
  );
}
