import mainIcon from "@/assets/mainIcon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "@/services/api";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        username,
        password,
      });

      const { accessToken } = res.data;
      localStorage.setItem("accessToken", accessToken);

      const userRes = await API.get("/auth/me");
      const userId = userRes.data.id; // 서버에서 사용자 ID 가져옴

      // Zustand 스토어 업데이트
      login(userId);

      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("로그인 에러:", error);
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.");
    }
  };
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background px-4'>
      <div className='flex w-full flex-col items-center gap-10'>
        {/* 로고 섹션 */}
        <div className='flex flex-col items-center gap-4'>
          <img
            src={mainIcon}
            alt='Review-Log Logo'
            className='w-24 h-24 object-contain'
          />
          <h1 className='text-[4rem] font-bold tracking-tight text-main-gray'>
            Review—Log
          </h1>
        </div>

        {/* 폼 섹션 */}
        <form
          onSubmit={handleLogin}
          className='flex w-96 flex-col items-center gap-[12px]'
        >
          <Input
            type='text'
            placeholder='아이디'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete='username'
            className='text-center'
          />
          <Input
            type='password'
            placeholder='비밀번호'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='current-password'
            className='text-center'
          />

          <Button type='submit'>시작하기</Button>
          {/* 하단 링크 */}
          <Link
            to='/join'
            className='text-sm text-main-gray underline underline-offset-4 hover:text-black'
          >
            회원가입
          </Link>
        </form>
      </div>
    </div>
  );
}
