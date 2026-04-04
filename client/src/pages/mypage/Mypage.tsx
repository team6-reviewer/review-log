import Header from "@/components/layout/Header";
import TagFilter from "@/components/layout/TagFilter";
import ReviewList from "@/components/layout/ReviewList";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyReviews, getReviews } from "@/services/review";

export default function Mypage() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("write_date_desc");
  const [type, setType] = useState("전체");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 모든 필터 및 검색 초기화 함수
  const handleReset = () => {
    setPage(1);
    setSort("write_date_desc");
    setSelectedTags([]);
  };

  // 내 리뷰 목록 조회
  const { data: reviewData, isLoading } = useQuery({
    queryKey: ["myReviews", { page, sort, type, tags: selectedTags }],
    queryFn: () => getMyReviews({ page, sort, type, tags: selectedTags }),
    placeholderData: (prev) => prev,
  });

  return (
    <div className='min-h-screen bg-background pb-20'>
      <Header
        isMyPage={true}
        activeTab={type}
        keyword=''
        onTabChange={(t) => {
          setType(t);
          setPage(1);
        }}
        onSearch={() => {}}
      />
      <div className='max-w-[1400px] mx-auto px-6 mt-10'>
        <div className='flex flex-col gap-8'>
          <TagFilter
            selectedTags={selectedTags}
            onTagClick={(tag) => {
              setSelectedTags((prev) =>
                prev.includes(tag)
                  ? prev.filter((t) => t !== tag)
                  : [...prev, tag],
              );
              setPage(1);
            }}
          />

          <ReviewList
            reviews={reviewData?.data || []}
            total={reviewData?.total || 0}
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            sort={sort}
            setSort={setSort}
            keyword=''
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
