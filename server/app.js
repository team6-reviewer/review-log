const dotenv = require("dotenv");
const pool = require("./config/db");

dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes"); // 사용자계정 및 토큰재발급
const bookRoutes = require("./routes/bookRoutes"); // 알라딘 api로부터 조회, 검색
const movieRoutes = require("./routes/movieRoutes"); // TMDB api로부터 조회, 검색

const app = express();

// CORS 미들웨어 적용
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, //쿠키 전송 허용
  }),
);

app.use(express.json());
app.use(cookieParser()); // 프론트가 보낸 쿠키(Refresh Token) 파서

app.get("/", (req, res) => {
  res.json({ message: "mymvc02 backend server running" });
});

app.use("/api/auth", authRoutes);

// DB 연결 테스트
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT NOW() AS now");
    res.json({
      success: true,
      message: "DB 연결 성공",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "DB 연결 실패",
      error: error.message,
    });
  }
});


app.use("/api/book", bookRoutes);
app.use("/api/movie", movieRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 서버 실행 중`);
});
