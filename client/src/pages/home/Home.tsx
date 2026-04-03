import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import TagFilter from "@/components/layout/TagFilter";
import RecommendSection from "@/components/layout/RecommendSection";
import ReviewList from "@/components/layout/ReviewList";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReviews } from "@/services/review";
import { getRankings } from "@/services/ranking";

export default function Home() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("write_date_desc");
  const [type, setType] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 모든 필터 및 검색 초기화 함수
  const handleReset = () => {
    setPage(1);
    setSort("write_date_desc");
    setKeyword("");
    setSelectedTags([]);
  };

  // 전체 리뷰 목록 조회
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviews", { page, sort, type, keyword, tags: selectedTags }],
    queryFn: () =>
      getReviews({ page, sort, type, keyword, tags: selectedTags }),
    placeholderData: (previousData) => previousData,
  });

  // 순위 조회
  const { data: rankingData } = useQuery({
    queryKey: ["rankings"],
    queryFn: getRankings,
    refetchOnWindowFocus: false,
  });

  return (
    <div className='min-h-screen bg-background pb-20'>
      <Header
        activeTab={type}
        keyword={keyword}
        onTabChange={(t) => {
          setType(t);
          setPage(1);
        }}
        onSearch={(k) => {
          setKeyword(k);
          setPage(1);
        }}
      />
      <div className='max-w-[1400px] mx-auto px-6'>
        <div className='mt-10 flex flex-row gap-10 items-start'>
          <Sidebar rankingData={rankingData} />

          <div className='flex-[3_3_75%] min-w-0 flex flex-col gap-8 transition-all duration-300'>
            <TagFilter
              selectedTags={selectedTags}
              onTagClick={(tagname) => {
                setSelectedTags((prev) =>
                  prev.includes(tagname)
                    ? prev.filter((t) => t !== tagname)
                    : [...prev, tagname],
                );
                setPage(1);
              }}
            />
            <RecommendSection />
          </div>
        </div>

        <ReviewList
          reviews={data?.data || []}
          total={data?.total || 0}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          sort={sort}
          setSort={setSort}
          keyword={keyword}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
