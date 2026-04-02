import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9000/api",
  withCredentials: true, // 쿠키를 포함한 요청을 보내도록 설정
});

// 1. 요청 인터셉터 : 서버로 데이터를 보내기 직전에 실행
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. 응답 인터셉터 : 서버로부터 응답이 도착했을 때 실행
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 발생 시 자동 재발급 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true },
        );
        const { accessToken } = res.data;

        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // 실패했던 원래 요청을 다시 보냄
        return API(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("accessToken");
        window.location.href = "/"; // 추후 /login으로 변경
        return Promise.reject(refreshError);
      }
    }

    // 401 이외 에러 처리
    return Promise.reject(error);
  },
);

export default API;
