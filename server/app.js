const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const movieRoutes = require("./routes/movieRoutes"); // TMDB api로부터 조회, 검색


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

app.use("/api/movie", movieRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 서버 실행 중`);
})