import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import mainIcon from "@/assets/mainIcon.png";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function Header({
  activeTab,
  onTabChange,
  onSearch,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch: (keyword: string) => void;
}) {
  const [searchType, setSearchType] = useState("total");
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  return (
    <header className='w-full bg-white shadow-md'>
      <div className='max-w-[1440px] mx-auto p-8 h-[120px] flex items-center justify-between gap-2'>
        {/* 로고 */}
        <button
          className='flex items-center gap-3 shrink-0'
          onClick={() => navigate("/home")}
        >
          <img src={mainIcon} alt='Logo' className='w-12 h-12' />
          <h1 className='text-[40px] font-bold text-[#444] tracking-tight leading-none'>
            Review—Log
          </h1>
        </button>

        {/* 중앙 탭 */}
        <nav className='relative flex items-center mb-[-2px]'>
          <div className='absolute bottom-0 left-[-20px] right-[-20px] h-[1px] bg-[#D1D5DB]' />

          <div className='flex gap-16 relative'>
            {["전체", "영화", "도서"].map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={cn(
                  "relative pb-4 text-[36px] font-bold transition-all px-2",
                  activeTab === tab ? "text-[#000]" : "text-[#D1D5DB]",
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className='absolute bottom-0 left-0 right-0 h-[5px] bg-[#000] z-10' />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* 검색 섹션*/}
        <div className='flex flex-col gap-3'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearch(searchKeyword);
            }}
            className='flex items-center gap-2'
          >
            <Input
              placeholder='제목으로 검색'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Button
              className='w-[80px] text-[18px] font-bold shrink-0'
              type='submit'
            >
              검색
            </Button>
          </form>

          <div className='flex items-center gap-4'>
            {[
              { id: "total", label: "통합검색" },
              { id: "title", label: "작품명" },
              { id: "content", label: "글내용" },
            ].map((type) => (
              <label
                key={type.id}
                className='flex items-center gap-1.5 cursor-pointer group'
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                    searchType === type.id
                      ? "border-[#444] bg-white"
                      : "border-[#D1D5DB] bg-white",
                  )}
                >
                  {searchType === type.id && (
                    <div className='w-2 h-2 rounded-full bg-[#3B82F6]' />
                  )}
                </div>
                <input
                  type='radio'
                  className='hidden'
                  checked={searchType === type.id}
                  onChange={() => setSearchType(type.id)}
                />
                <span
                  className={cn(
                    "text-[14px] font-medium",
                    searchType === type.id ? "text-[#333]" : "text-[#666]",
                  )}
                >
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
