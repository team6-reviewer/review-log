import Header from "@/components/layout/Header";
import TagFilter from "@/components/layout/TagFilter";
import ReviewList from "@/components/layout/ReviewList";
import ReviewModal from "@/components/review/ReviewModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyReviews } from "@/services/review";

export default function Mypage() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("write_date_desc");
  const [type, setType] = useState("전체");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 모달 관련 상태
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    mode: "view" | "edit";
    reviewId?: number;
  }>({ isOpen: false, mode: "view" });

  const handleReset = () => {
    setPage(1);
    setSort("write_date_desc");
    setSelectedTags([]);
  };

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
            onReviewClick={(id: number) =>
              setModalConfig({ isOpen: true, mode: "view", reviewId: id })
            }
          />
        </div>
      </div>

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
