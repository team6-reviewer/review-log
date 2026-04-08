import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import API from "@/services/api";

interface SearchStepProps {
  onNext: (work: any) => void;
  onClose: () => void;
}

/**
 * 리뷰 작성 전 작품 검색 단계 컴포넌트
 * @param onNext 검색에서 작품 선택 시 호출되는 함수 (선택한 작품 데이터가 인자로 전달됨)
 * @param onClose 모달 닫기 함수
 */
export default function SearchStep({ onNext, onClose }: SearchStepProps) {
  const [searchType, setSearchType] = useState<"movie" | "book">("movie");
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false); // 검색 실행 여부 상태

  // 작품 검색 함수 (영화/도서 구분하여 API 호출)
  const handleSearch = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return alert("검색어를 입력해주세요.");

    setIsLoading(true);
    try {
      const endpoint =
        searchType === "movie" ? "/movie/search" : "/book/search";
      const { data } = await API.get(endpoint, {
        params: { q: keyword },
      });
      setResults(data || []);
      setIsSearched(true);
    } catch (error: any) {
      alert(error.response?.data?.message || "검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 결과에서 작품 선택 시 작품 데이터를 다음 단계로 전달
  const handleItemClick = (item: any) => {
    const payload = {
      title: item.title,
      posterPath: item.posterPath,
      contentType: searchType,
    };
    onNext(payload);
  };

  return (
    <div className='p-10 flex flex-col items-center w-full h-full min-h-[700px]'>
      <div className='w-full max-w-[480px] flex flex-col gap-4 mb-12'>
        <form onSubmit={handleSearch} className='flex gap-2'>
          <Input
            placeholder='제목으로 검색'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className='h-12 border border-main-gray focus:border-black rounded-lg text-[16px]'
          />
          <Button
            type='submit'
            variant='primary'
            className='w-20'
            disabled={isLoading}
          >
            {isLoading ? "검색 중" : "검색"}
          </Button>
        </form>

        <div className='flex justify-start gap-6 ml-1'>
          {[
            { id: "movie", label: "영화" },
            { id: "book", label: "도서" },
          ].map((type) => (
            <label
              key={type.id}
              className='flex items-center gap-2 cursor-pointer group'
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                  searchType === type.id
                    ? "border-main-gray bg-white"
                    : "border-dark-gray bg-white",
                )}
              >
                {searchType === type.id && (
                  <div className='w-2 h-2 rounded-full bg-movie-title' />
                )}
              </div>
              <input
                type='radio'
                className='hidden'
                checked={searchType === type.id}
                onChange={() => {
                  setSearchType(type.id as any);
                  setResults([]);
                }}
              />
              <span
                className={cn(
                  "text-[15px] font-bold",
                  searchType === type.id ? "text-main-gray" : "text-dark-gray",
                )}
              >
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className='w-full flex-1 overflow-y-auto scrollbar-hide px-2 mb-10'>
        {isLoading ? (
          // 검색 중일 때 보여줄 스켈레톤 UI
          <div className='grid grid-cols-5 gap-x-5 gap-y-10 animate-pulse'>
            {[...Array(10)].map((_, i) => (
              <div key={i} className='flex flex-col gap-3'>
                <div className='aspect-[2/3] rounded-lg bg-gray-200' />
                {/* 포스터 자리 */}
                <div className='h-4 bg-gray-200 rounded w-full' />
                {/* 타이틀 첫 줄 */}
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className='grid grid-cols-5 gap-x-5 gap-y-10'>
            {results.map((item) => (
              <div
                key={item.id}
                className='flex flex-col gap-3 cursor-pointer group'
                onClick={() => handleItemClick(item)}
              >
                <div className='aspect-[2/3] rounded-lg overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-200'>
                  <img
                    src={item.posterPath}
                    alt={item.title}
                    className='w-full h-full object-cover'
                  />
                </div>
                <p className='text-[14px] font-bold text-main-gray leading-[1.3] line-clamp-2 px-0.5 group-hover:text-black'>
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className='h-full flex items-center justify-center text-main-gray'>
            {isSearched ? "검색 결과가 없습니다." : "작품을 검색해보세요!"}
          </div>
        )}
      </div>

      <Button onClick={onClose} variant='primary' className='w-[152px]'>
        닫기
      </Button>
    </div>
  );
}
