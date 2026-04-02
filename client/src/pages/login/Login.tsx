import mainIcon from "@/assets/mainIcon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "@/services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        username,
        password,
      });

      const { accessToken } = res.data;
      localStorage.setItem("accessToken", accessToken);

      navigate("/home", { replace: true }); // 추후 /으로 변경
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
            className='h-12 border-main-gray bg-white text-center rounded-lg focus-visible:ring-1 focus-visible:ring-main-gray text-[16px]'
          />
          <Input
            type='password'
            placeholder='비밀번호'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='current-password'
            className='h-12 border-main-gray bg-white text-center rounded-lg focus-visible:ring-1 focus-visible:ring-main-gray text-[16px]'
          />

          <Button
            type='submit'
            className='h-12 w-full bg-main-gray text-white hover:bg-black rounded-lg text-[16px]'
          >
            시작하기
          </Button>
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
