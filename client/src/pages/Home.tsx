import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import TagFilter from "@/components/layout/TagFilter";
import RecommendSection from "@/components/layout/RecommendSection";
import ReviewList from "@/components/layout/ReviewList";
import ReviewModal from "@/components/review/ReviewModal"; // 🚀 모달 추가
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviews } from "@/services/review";
import { getRankings } from "@/services/ranking";
import API from "@/services/api";

export default function Home() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("write_date_desc");
  const [type, setType] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchType, setSearchType] = useState("total");

  // 모달 상태 관리
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    mode: "create" | "view" | "edit";
    reviewId?: number;
  }>({ isOpen: false, mode: "view" });

  const handleReset = () => {
    setPage(1);
    setSort("write_date_desc");
    setKeyword("");
    setSearchType("total");
    setSelectedTags([]);
  };

  // 전체 리뷰 목록 조회
  const { data, isLoading } = useQuery({
    queryKey: [
      "reviews",
      { page, sort, type, keyword, searchType, tags: selectedTags },
    ],
    queryFn: () =>
      getReviews({ page, sort, type, keyword, searchType, tags: selectedTags }),
    placeholderData: (previousData) => previousData,
  });

  // 순위 조회
  const { data: rankingData } = useQuery({
    queryKey: ["rankings"],
    queryFn: getRankings,
    refetchOnWindowFocus: false,
  });

  // 삭제 Mutation (ReviewList에서 사용)
  const deleteMutation = useMutation({
    mutationFn: (id: number) => API.delete(`/reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      alert("리뷰가 삭제되었습니다.");
    },
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
        onSearch={(k, st) => {
          setKeyword(k);
          setSearchType(st);
          setPage(1);
        }}
      />
      <div className='max-w-[1400px] mx-auto px-6'>
        <div className='mt-10 flex flex-row gap-10 items-start'>
          <Sidebar
            rankingData={rankingData}
            onCreateReview={() =>
              setModalConfig({ isOpen: true, mode: "create" })
            }
          />

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
            {/* 추후 추천 섹션 카드 클릭 시 상세조회 연결 예정 */}
            <RecommendSection
              onReviewClick={(id: number) =>
                setModalConfig({ isOpen: true, mode: "view", reviewId: id })
              }
            />
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
          onReviewClick={(id: number) =>
            setModalConfig({ isOpen: true, mode: "view", reviewId: id })
          }
          onEditClick={(id: number) =>
            setModalConfig({ isOpen: true, mode: "edit", reviewId: id })
          }
          onDeleteClick={(id: number) => {
            if (window.confirm("정말 삭제하시겠습니까?"))
              deleteMutation.mutate(id);
          }}
        />
      </div>

      {/* 전역 리뷰 모달 */}
      {modalConfig.isOpen && (
        <ReviewModal
          mode={modalConfig.mode}
          reviewId={modalConfig.reviewId}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        />
      )}
    </div>
  );
}
