import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import TagFilter from "@/components/layout/TagFilter";
import RecommendSection from "@/components/layout/RecommendSection";
import ReviewList from "@/components/layout/ReviewList";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReviews } from "@/services/review";

export default function Home() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("write_date_desc");
  const [type, setType] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 🔥 탄스택 쿼리 핵심 로직
  const { data, isLoading, isError } = useQuery({
    // queryKey에 넣은 값 중 하나라도 바뀌면 재실행
    queryKey: ["reviews", { page, sort, type, keyword, tags: selectedTags }],
    queryFn: () =>
      getReviews({ page, sort, type, keyword, tags: selectedTags }),
    placeholderData: (previousData) => previousData, // 페이지 넘길 때 깜빡임 방지
  });

  console.log(data);

  return (
    <div className='min-h-screen bg-background pb-20'>
      {/* 헤더 */}
      <Header
        activeTab={type}
        onTabChange={(t) => {
          setType(t);
          setPage(1);
        }}
        onSearch={(k) => {
          setKeyword(k);
          setPage(1);
        }}
      />
      {/* 메인 컨텐츠 영역 */}
      <div className='max-w-[1400px] mx-auto px-6'>
        {/* 상단 레이아웃 섹션 */}
        <div className='mt-10 flex flex-row gap-10 items-start'>
          {/* 왼쪽 사이드바 (마이페이지, 리뷰쓰기, 랭킹) */}
          <Sidebar />

          <div className='flex-[3_3_75%] min-w-0 flex flex-col gap-8 transition-all duration-300'>
            {/* 태그 필터 영역 */}
            <TagFilter
              selectedTags={selectedTags}
              onTagClick={(tagname) => {
                setSelectedTags((prev) =>
                  prev.includes(tagname)
                    ? prev.filter((t) => t !== tagname)
                    : [...prev, tagname],
                );
                setPage(1); // 필터 바뀌면 1페이지로 이동
              }}
            />
            {/* 추천 리뷰 섹션  */}
            <RecommendSection />
          </div>
        </div>

        {/* 하단 전체 리뷰 리스트 */}
        <ReviewList
          reviews={data?.data || []}
          total={data?.total || 0}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          sort={sort}
          setSort={setSort}
        />
      </div>
    </div>
  );
}
