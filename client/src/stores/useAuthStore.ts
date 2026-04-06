import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  userId: number | null;
  isLoggedIn: boolean;
  login: (id: number) => void;
  logout: () => void;
}

// 새로고침해도 로그인 안 풀리게 로컬스토리지에 저장
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
