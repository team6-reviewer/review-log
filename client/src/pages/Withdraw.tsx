import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import API from "@/services/api";

export default function Withdraw() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleWithdraw = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!password) {
      alert("본인 확인을 위해 비밀번호를 입력해 주세요.");
      return;
    }

    if (
      !window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await API.post("/auth/withdraw", { password });

      if (res.status === 200) {
        localStorage.removeItem("accessToken"); // 메모리/로컬 토큰 삭제

        alert("회원 탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.");
        window.location.href = "/login";
      }
    } catch (error: any) {
      const status = error.response?.status;

      if (status === 400) {
        alert("비밀번호가 일치하지 않습니다.");
      } else if (status === 401) {
        alert("인증 세션이 만료되었습니다. 다시 로그인 후 시도해 주세요.");
        navigate("/login");
      } else if (status === 404) {
        alert("사용자 정보를 찾을 수 없습니다.");
      } else {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background px-4'>
      <div className='flex w-full max-w-[600px] flex-col items-center justify-center rounded-[20px] border border-main-gray bg-white p-12 shadow-sm'>
        <div className='flex flex-col items-center text-center gap-2 mb-8'>
          <h2 className='text-[20px] font-bold text-main-gray'>
            정말 탈퇴하시겠습니까?
          </h2>
          <p className='text-[16px] text-main-gray leading-relaxed'>
            작성한 리뷰는 모두 삭제되며, 되돌릴 수 없습니다.
          </p>
        </div>

        {/* 비밀번호 확인 섹션 */}
        <form
          onSubmit={handleWithdraw}
          className='flex w-full max-w-[320px] flex-col items-center gap-6'
        >
          <div className='w-full flex flex-col gap-2'>
            <p className='text-[14px] text-dark-gray text-center'>
              본인 확인을 위해 비밀번호를 입력해 주세요.
            </p>
            <Input
              type='password'
              placeholder='현재 비밀번호'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='current-password'
            />
          </div>

          {/* 버튼 그룹 */}
          <div className='flex w-full gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate("/mypage")} // 탈퇴하기는 마이페이지에서만 이동 가능하므로, 뒤로가기 시 마이페이지로 이동
              className='flex-1 bg-white border-main-gray text-main-gray hover:bg-light-gray'
            >
              뒤로가기
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='flex-1 bg-destructive hover:bg-red-700 border-none'
            >
              {isLoading ? "처리 중..." : "탈퇴하기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
