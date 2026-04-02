const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

module.exports = {
  // 1. AccessToken 생성 (유효기간 30분, Payload에는 유저고유번호 id만)
  generateAccessToken: (id) => {
    return jwt.sign({ id }, ACCESS_SECRET, { expiresIn: "30m" });
  },

  // 2. RefreshToken 생성 (유효기간 14일, Payload에는 유저고유번호 id만)
  generateRefreshToken: (id) => {
    return jwt.sign({ id }, REFRESH_SECRET, { expiresIn: "14d" });
  },

  // 3. AccessToken 검증
  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, ACCESS_SECRET);
    } catch (error) {
      return null; // 만료되었거나 가짜면 null 반환
    }
  },

  // 4. RefreshToken 검증
  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, REFRESH_SECRET);
    } catch (error) {
      return null;
    }
  },
};
