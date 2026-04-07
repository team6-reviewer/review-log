import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

/**
 * 보호된 라우트 컴포넌트
 * @returns 로그인 여부에 따라 자식 라우트 또는 로그인 페이지로 이동하는 JSX
 */
export default function ProtectedRoute() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // 로그인 안 되어 있으면 로그인 페이지로 강제 이동
  if (!isLoggedIn) {
    return <Navigate to='/login' replace />;
  }

  // 로그인 되어 있으면 자식 라우트(<Outlet />) 렌더링
  return <Outlet />;
}
