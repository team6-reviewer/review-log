import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9000/api",
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
  (error) => {
    // 서버가 없거나 네트워크가 끊겼을 때 처리 (에러 객체가 없을 수도 있음)
    if (!error.response) {
      console.error("서버와 연결할 수 없습니다.");
      return Promise.reject(error);
    }

    const { status } = error.response;

    if (status === 401) {
      // 401: 인증 만료
      localStorage.removeItem("accessToken");

      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      window.location.href = "/login";
    }

    if (status === 403) {
      // 403: 권한 없음 (로그인은 됐는데 접근 권한이 없는 경우)
      alert("해당 페이지에 접근할 권한이 없습니다.");
    }

    return Promise.reject(error);
  },
);

export default API;
