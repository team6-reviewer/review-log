const mysql = require("mysql2/promise"); // async/await를 사용할 수 있는 promise 패턴
const dotenv = require("dotenv");
dotenv.config();

// DB 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // 최대 연결 수
});

module.exports = pool;
