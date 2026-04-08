import mainIcon from "@/assets/mainIcon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import API from "@/services/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  activeTab: string;
  keyword: string;
  onTabChange: (tab: string) => void;
  onSearch: (keyword: string, searchType: string) => void;
  isMyPage?: boolean;
}

/**
 * 헤더 컴포넌트
 * @param activeTab 현재 활성화된 탭 ("전체", "영화", "도서")
 * @param keyword 검색어
 * @param onTabChange 탭 변경 핸들러 함수
 * @param onSearch 검색 핸들러 함수
 * @param isMyPage 마이페이지 여부 (기본값: false)
 */
export default function Header({
  activeTab,
  keyword,
  onTabChange,
  onSearch,
  isMyPage = false,
}: HeaderProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  const [searchType, setSearchType] = useState("total");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState("");

  // 외부에서 keyword가 비워지면 내부 인풋도 비워줌
  useEffect(() => {
    setSearchKeyword(keyword);
    if (keyword === "") setSearchType("total");
  }, [keyword]);

  // 마이페이지일 때만 내 정보 조회 (캐시 공유)
  const { data: userData } = useQuery({
    queryKey: ["me"],
    queryFn: () => API.get("/auth/me").then((res) => res.data),
    enabled: isMyPage,
  });

  // 닉네임 수정
  const updateNicknameMutation = useMutation({
    mutationFn: (nickname: string) => API.patch("/auth/nickname", { nickname }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setIsEditing(false);
    },
    onError: (err: any) => alert(err.response?.data?.message || "수정 실패"),
  });

  // 로그아웃 처리
  const logoutMutation = useMutation({
    mutationFn: () => API.post("/auth/logout"),
    onSuccess: () => {
      queryClient.clear();
      logout();

      alert("로그아웃 되었습니다.");
      navigate("/", { replace: true });
    },
  });

  // 로그아웃 핸들러 함수
  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logoutMutation.mutate();
    }
  };

  return (
    <header className='w-full bg-white shadow-md'>
      <div className='max-w-[1440px] mx-auto p-8 h-[120px] flex items-center justify-between gap-2'>
        <div className='flex items-center gap-3'>
          {isMyPage && !isEditing && (
            // 홈 이동 버튼 (마이페이지에서만 보임)
            <button
              onClick={() => navigate("/")}
              className='p-1 group'
              title='홈으로 이동'
            >
              <ChevronLeft
                size={28}
                className='text-main-gray group-hover:text-black transition-colors'
              />
            </button>
          )}
          <img src={mainIcon} alt='Logo' className='w-12 h-12' />
          {isMyPage ? (
            <>
              {isEditing ? (
                /* 닉네임 수정 모드: 닉네임이 input으로 바뀜 */
                <div className='flex items-center gap-2'>
                  <Input
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    className='w-28 h-12 font-bold'
                    autoFocus
                  />
                  <Button
                    onClick={() => updateNicknameMutation.mutate(editNickname)}
                    variant='primary'
                    className='w-20'
                  >
                    저장
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={() => setIsEditing(false)}
                    className='w-20'
                  >
                    취소
                  </Button>
                </div>
              ) : (
                /* 일반 모드: 닉네임 + 수정 버튼 */
                <div className='flex items-center gap-3'>
                  <span className='text-[30px] font-bold text-main-gray whitespace-nowrap'>
                    {userData?.nickname}
                  </span>
                  <Button
                    onClick={() => {
                      setEditNickname(userData?.nickname || "");
                      setIsEditing(true);
                    }}
                    className='w-[70px]'
                  >
                    수정
                  </Button>
                </div>
              )}
            </>
          ) : (
            // 메인 화면에서는 닉네임 없이 로고와 타이틀만 보임
            <h1 className='text-[36px] font-bold text-main-gray tracking-tight'>
              Review—Log
            </h1>
          )}
        </div>

        {/* 네비게이션 (전체탭, 영화탭, 도서탭) */}
        <nav className='relative flex items-center mb-[-2px]'>
          <div className='absolute bottom-0 left-[-20px] right-[-20px] h-[1px] bg-light-gray' />
          <div className='flex gap-16 relative'>
            {["전체", "영화", "도서"].map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={cn(
                  "relative pb-4 text-[28px] font-bold transition-all px-2 text-nowrap",
                  activeTab === tab ? "text-black" : "text-light-gray",
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className='absolute bottom-0 left-0 right-0 h-[5px] bg-black z-10' />
                )}
              </button>
            ))}
          </div>
        </nav>

        <div className='flex flex-col gap-2'>
          {isMyPage ? (
            // 마이페이지에서는 로그아웃 및 회원탈퇴 버튼
            <>
              <Button
                variant='secondary'
                onClick={handleLogout}
                className='w-40 px-4 flex items-center gap-2 font-medium'
              >
                <User size={20} className='fill-current' />
                로그아웃
              </Button>
              <button
                className='text-destructive hover:text-red-900 font-medium underline underline-offset-4'
                onClick={() => navigate("/withdraw")}
              >
                회원탈퇴
              </button>
            </>
          ) : (
            // 메인 화면에서는 검색창
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSearch(searchKeyword, searchType);
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
                          ? "border-main-gray bg-white"
                          : "border-light-gray bg-white",
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
                      onChange={() => setSearchType(type.id)}
                    />
                    <span
                      className={cn(
                        "text-[14px] font-medium",
                        searchType === type.id
                          ? "text-main-gray"
                          : "text-dark-gray",
                      )}
                    >
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
