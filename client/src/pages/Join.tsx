import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import API from "@/services/api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 회원가입 페이지 컴포넌트
 */
export default function Join() {
  const navigate = useNavigate();

  // 입력값 상태
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordCheck: "",
    nickname: "",
  });

  // 에러 메시지 상태 (입력 시작 전에는 안 보이게)
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    passwordCheck: "",
    nickname: "",
  });

  // 사용자가 해당 필드를 건드렸는지 확인 (Touched 상태)
  const [touched, setTouched] = useState({
    username: false,
    password: false,
    passwordCheck: false,
    nickname: false,
  });

  // 실시간 유효성 검사 로직
  useEffect(() => {
    const newErrors = { ...errors };

    // 아이디 검사: 영문/숫자 5~20자
    if (touched.username) {
      const usernameRegex = /^[a-zA-Z0-9]{5,20}$/;
      newErrors.username = usernameRegex.test(formData.username)
        ? ""
        : "아이디는 영문/숫자 5~20자로 입력해 주세요.";
    }

    // 비밀번호 검사: 최소 8자, 공백 불가
    if (touched.password) {
      newErrors.password =
        formData.password.length >= 8 && !formData.password.includes(" ")
          ? ""
          : "비밀번호는 공백 없이 8자 이상으로 입력해 주세요.";
    }

    // 비밀번호 확인 검사
    if (touched.passwordCheck) {
      newErrors.passwordCheck =
        formData.password === formData.passwordCheck
          ? ""
          : "비밀번호가 일치하는지 확인해 주세요.";
    }

    // 닉네임 검사: 2~20자
    if (touched.nickname) {
      newErrors.nickname =
        formData.nickname.length >= 2 && formData.nickname.length <= 20
          ? ""
          : "닉네임은 2~20자로 입력해 주세요.";
    }

    setErrors(newErrors);
  }, [formData, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 입력 필드에서 포커스가 벗어났을 때 해당 필드를 touched 상태로 업데이트
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // 회원가입 처리 함수
  const handleJoin = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    // 모든 필드를 touched 상태로 만들어 에러 표시 강제 활성화
    setTouched({
      username: true,
      password: true,
      passwordCheck: true,
      nickname: true,
    });

    // 모든 에러가 비어있고 값이 다 채워졌는지 확인
    const isFormValid =
      Object.values(errors).every((err) => err === "") &&
      Object.values(formData).every((val) => val !== "");

    if (!isFormValid) return;

    try {
      const res = await API.post("/auth/signup", {
        username: formData.username,
        password: formData.password,
        nickname: formData.nickname,
      });

      if (res.status === 201) {
        alert("회원가입이 완료되었습니다!");
        navigate("/login"); // 로그인 페이지로 이동
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        alert(error.response.data.message || "입력값을 확인해 주세요.");
      } else {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10'>
      <div className='flex w-full max-w-[400px] flex-col items-center gap-8'>
        <h1 className='text-[2.5rem] font-bold text-main-gray'>회원가입</h1>

        <form onSubmit={handleJoin} className='flex w-full flex-col gap-4'>
          {/* 아이디 입력 */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-main-gray ml-1'>
              아이디
            </label>
            <Input
              name='username'
              placeholder='영문/숫자 5~20자'
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete='username'
            />
            {errors.username && (
              <p className='text-[12px] text-destructive ml-1'>
                {errors.username}
              </p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-main-gray ml-1'>
              비밀번호
            </label>
            <Input
              name='password'
              type='password'
              placeholder='8자 이상'
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete='new-password'
            />
            {errors.password && (
              <p className='text-[12px] text-destructive ml-1'>
                {errors.password}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-main-gray ml-1'>
              비밀번호 확인
            </label>
            <Input
              name='passwordCheck'
              type='password'
              placeholder='8자 이상'
              value={formData.passwordCheck}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete='new-password'
            />
            {errors.passwordCheck && (
              <p className='text-[12px] text-destructive ml-1'>
                {errors.passwordCheck}
              </p>
            )}
          </div>

          {/* 닉네임 입력 */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-main-gray ml-1'>
              닉네임
            </label>
            <Input
              name='nickname'
              placeholder='2~20자'
              value={formData.nickname}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.nickname && (
              <p className='text-[12px] text-destructive ml-1'>
                {errors.nickname}
              </p>
            )}
          </div>

          <div className='flex justify-center gap-4 mt-4'>
            <Button
              type='button'
              onClick={() => navigate("/")}
              className='flex-1 border-main-gray bg-white text-main-gray hover:bg-light-gray'
            >
              뒤로가기
            </Button>
            <Button type='submit' className='flex-1'>
              시작하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
