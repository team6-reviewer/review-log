import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import mainIcon from "@/assets/mainIcon.png";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/services/api";
import { ChevronLeft, User } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  keyword: string;
  onTabChange: (tab: string) => void;
  onSearch: (keyword: string, searchType: string) => void;
  isMyPage?: boolean;
}

export default function Header({
  activeTab,
  keyword,
  onTabChange,
  onSearch,
  isMyPage = false,
}: HeaderProps) {
  const [searchType, setSearchType] = useState("total");
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState("");

  // 외부에서 keyword가 비워지면 내부 인풋도 비워줌
  useEffect(() => {
    setSearchKeyword(keyword);
    if (keyword === "") setSearchType("total");
  }, [keyword]);

  // 마이페이지일 때만 내 정보 조회 (캐시 공유용)
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
      alert("로그아웃 되었습니다.");
      navigate("/"); // 추후 /login으로 변경
    },
  });

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
            <button
              onClick={() => navigate("/home")}
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
                /* 수정 모드: 닉네임이 input으로 바뀜 */
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
                  <span className='text-[30px] font-bold text-main-gray'>
                    {userData?.nickname}
                  </span>
                  <Button
                    onClick={() => {
                      setEditNickname(userData?.nickname || "");
                      setIsEditing(true);
                    }}
                  >
                    수정
                  </Button>
                </div>
              )}
            </>
          ) : (
            <h1 className='text-[36px] font-bold text-main-gray tracking-tight'>
              Review—Log
            </h1>
          )}
        </div>

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
