const { verifyAccessToken } = require("../utils/jwtUtil");

// JWT토큰을 검증
module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // 1. 헤더에 AccessToken 자체가 없는 경우 (비로그인 유저) -> 프론트: 로그인 페이지(/login)로 리다이렉트
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: 401,
      errorCode: "ACCESS_TOKEN_MISSING",
      message: "토큰이 없습니다. 로그인이 필요합니다.",
    });
  }

  // Bearer <token> 형태에서 토큰만 추출
  const token = authHeader.split(" ")[1];

  // AccessToken검증
  const decoded = verifyAccessToken(token);

  // 2. 로그인 유저지만 AccessToken이 만료되었거나 유효하지 않은 경우 -> 프론트: POST /api/auth/refresh를 호출.
  if (!decoded) {
    return res.status(401).json({
      status: 401,
      errorCode: "ACCESS_TOKEN_EXPIRED",
      message: "액세스 토큰이 만료되었거나 올바르지 않습니다.",
    });
  }

  // 3. 검증 성공 시, 토큰에서 꺼낸 유저고유번호 id를 req 객체에 심어서 다음으로 넘김
  req.user = { id: decoded.id };
  next();
};
