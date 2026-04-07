import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  userId: number | null;
  isLoggedIn: boolean;
  login: (id: number) => void;
  logout: () => void;
}

/**
 * 인증 상태 관리를 위한 Zustand 스토어
 * - userId: 로그인한 사용자의 ID (null이면 로그인 안 된 상태)
 * - isLoggedIn: 로그인 여부
 * - login: 로그인 시 사용자 ID를 저장하고 로그인 상태로 변경하는 함수
 * - logout: 로그아웃 시 사용자 ID를 null로 초기화하고 로그인 상태로 변경하는 함수
 * - persist 미들웨어를 사용하여 로컬스토리지에 인증 상태를 저장하므로, 새로고침해도 로그인 상태 유지
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      isLoggedIn: false,
      login: (id) => set({ userId: id, isLoggedIn: true }),
      logout: () => set({ userId: null, isLoggedIn: false }),
    }),
    { name: "auth" },
  ),
);
