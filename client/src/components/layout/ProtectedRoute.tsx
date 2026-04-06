import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

export default function ProtectedRoute() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // 로그인 안 되어 있으면 로그인('/') 페이지로 강제 이동
  if (!isLoggedIn) {
    alert("로그인이 필요한 서비스입니다.");
    return <Navigate to='/' replace />; // 추후 /login으로 변경 예정
  }

  // 로그인 되어 있으면 자식 라우트(<Outlet />) 렌더링
  return <Outlet />;
}
