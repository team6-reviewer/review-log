const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./config/db");

dotenv.config();

const bookRoutes = require("./routes/bookRoutes"); // 알라딘 api로부터 조회, 검색
const movieRoutes = require("./routes/movieRoutes"); // TMDB api로부터 조회, 검색
const reviewRoutes = require("./routes/reviewRoutes"); // 리뷰 관련 라우터 추가

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "mymvc02 backend server running" });
});

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
app.use("/api", reviewRoutes); // 리뷰 라우터 연결 추가

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 서버 실행 중`);
})