const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwtUtil = require("../utils/jwtUtil");

module.exports = {
  // 1. 회원가입
  signup: async (req, res) => {
    try {
      // [입력 정제] 입력값 문자열 변환 및 양끝 공백 제거
      const username = req.body.username
        ? String(req.body.username).trim()
        : "";
      const password = req.body.password
        ? String(req.body.password).trim()
        : "";
      const nickname = req.body.nickname
        ? String(req.body.nickname).trim()
        : "";

      // [입력 검증] 필수 값 체크
      if (!username || !password || !nickname) {
        return res
          .status(400)
          .json({ message: "아이디, 비밀번호, 닉네임을 모두 입력하세요." });
      }

      // [입력 검증] 아이디, 비밀번호에 공백은 허용X
      if (username.includes(" ") || password.includes(" ")) {
        return res.status(400).json({
          message: "아이디와 비밀번호에는 공백을 포함할 수 없습니다.",
        });
      }

      // [입력 검증] 글자 수 체크
      if (username.length < 5 || username.length > 20) {
        return res
          .status(400)
          .json({ message: "아이디는 5자 이상 20자 이하이어야 합니다." });
      }
      if (nickname.length < 2 || nickname.length > 20) {
        return res
          .status(400)
          .json({ message: "닉네임은 2자 이상 20자 이하이어야 합니다." });
      }
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "비밀번호는 최소 8자 이상이어야 합니다." });
      }

      // [입력 검증] 아이디는 영어, 숫자만 허용
      const usernameRegex = /^[a-zA-Z0-9]*$/;
      if (!usernameRegex.test(username)) {
        return res
          .status(400)
          .json({ message: "아이디는 영문과 숫자만 사용 가능합니다." });
      }

      // [중복 검증] 아이디 중복 체크
      const existingUser = await userModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
      }

      // [중복 검증] 닉네임 중복 체크
      const existingNickname = await userModel.findByNickname(nickname);
      if (existingNickname) {
        return res.status(400).json({ message: "이미 존재하는 닉네임입니다." });
      }

      // 비밀번호 암호화 및 생성
      const hashedPassword = await bcrypt.hash(password, 10);
      // await userModel.createUser(username, hashedPassword, nickname);

      const newId = await userModel.createUser(
        username,
        hashedPassword,
        nickname,
      );
      console.log("[회원가입] 생성된 유저 id:", newId, hashedPassword); //확인용

      res.status(201).json({ message: "회원가입이 완료되었습니다." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "서버 에러" });
    }
  },

  // 2. 로그인 (토큰 최초 발급)
  login: async (req, res) => {
    try {
      // [입력 정제] 입력값 문자열 변환 및 양끝 공백 제거
      const username = req.body.username
        ? String(req.body.username).trim()
        : "";
      const password = req.body.password
        ? String(req.body.password).trim()
        : "";

      // [입력 검증] 필수 값 체크
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "아이디와 비밀번호를 입력하세요." });
      }

      // [입력 검증] 아이디 최대 글자 수 초과 시 즉시 컷 (서버 보호)
      if (username.length > 20) {
        return res
          .status(400)
          .json({ message: "올바르지 않은 아이디 형식입니다." });
      }

      const user = await userModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "존재하지 않는 사용자입니다." });
      }

      // DB 데이터 오염 방어
      let dbHash = user.password.trim();
      if (dbHash.endsWith(".")) {
        dbHash = dbHash.slice(0, -1);
      }

      const isMatch = await bcrypt.compare(password, dbHash);
      if (!isMatch) {
        return res.status(401).json({ message: "비밀번호가 틀렸습니다." });
      }

      // 토큰 생성 및 갱신 (Payload엔 유저고유번호 id만)
      const accessToken = jwtUtil.generateAccessToken(user.id);
      const refreshToken = jwtUtil.generateRefreshToken(user.id);

      // DB에 RefreshToken 저장
      await userModel.updateRefreshToken(user.id, refreshToken);

      // RefreshToken은 HttpOnly쿠키에 담음
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // HTTPS 환경에서만 허용여부 -> 실제 배포시에 바꿔줘야함
        sameSite: "lax", // 같은 도메인(localhost)끼리 주고받을수있음
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14일
      });

      // AccessToken은 프론트가 메모리에 들고 있도록 JSON으로 줌
      res.status(200).json({ accessToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "서버 에러" });
    }
  },

  // 3. 토큰 재발급
  refreshToken: async (req, res) => {
    try {
      // RefreshToken이 쿠키에 없을때 -> 프론트: 로그인 페이지(/login)로 리다이렉트
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({
          status: 401,
          errorCode: "REFRESH_TOKEN_MISSING",
          message: "Refresh Token이 없습니다.",
        });
      }

      //  RefreshToken이 쿠키에는 있지만 만료되었을때 -> 프론트: 로그인 페이지(/login)로 리다이렉트
      const decoded = jwtUtil.verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({
          status: 401,
          errorCode: "REFRESH_TOKEN_EXPIRED",
          message: "만료된 Refresh Token입니다.",
        });
      }

      // DB에 저장된 토큰과 날아온 토큰이 일치하는지 대조
      const user = await userModel.findById(decoded.id);
      if (!user || user.refreshtoken !== refreshToken) {
        return res
          .status(401)
          .json({ message: "유효하지 않은 Refresh Token입니다." });
      }

      // 모두 통과 시, 새 AccessToken 발급
      const newAccessToken = jwtUtil.generateAccessToken(user.id);
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "서버 에러" });
    }
  },

  // 4. 내 정보 조회
  getMe: async (req, res) => {
    try {
      // authMiddleware를 거쳐왔기 때문에 req.user.id가 존재
      const user = await userModel.findById(req.user.id);
      const { refreshtoken, ...safeUser } = user; // refreshtoken 제거 후 응답
      res.status(200).json(safeUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "서버 에러" });
    }
  },

  // 5. 닉네임 수정
  updateNickname: async (req, res) => {
    try {
      const nickname = req.body.nickname
        ? String(req.body.nickname).trim()
        : "";

      // [입력 검증] 필수 값 체크
      if (!nickname) {
        return res.status(400).json({ message: "변경할 닉네임을 입력하세요." });
      }

      // [입력 검증] 글자 수 검증
      if (nickname.length < 2 || nickname.length > 20) {
        return res
          .status(400)
          .json({ message: "닉네임은 2자 이상 20자 이하이어야 합니다." });
      }

      // 현재 로그인된 유저의 기존 정보 가져오기
      const currentUser = await userModel.findById(req.user.id);

      // [중복 검증] 기존 닉네임과 동일한지 검증
      if (currentUser.nickname === nickname) {
        return res.status(400).json({ message: "기존과 동일한 닉네임입니다." });
      }

      // [중복 검증] 다른 사람이 이미 쓰고 있는 닉네임인지 검증
      const existingNickname = await userModel.findByNickname(nickname);
      if (existingNickname) {
        return res
          .status(400)
          .json({ message: "이미 사용 중인 닉네임입니다." });
      }

      await userModel.updateNickname(req.user.id, nickname);
      res.status(200).json({ message: "닉네임이 성공적으로 수정되었습니다." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "서버 에러" });
    }
  },

  // 6. 로그아웃
  logout: async (req, res) => {
    try {
      // 1. DB에서 토큰 지우기
      await userModel.updateRefreshToken(req.user.id, null);
      // 2. 브라우저 쿠키 날리기
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "로그아웃 되었습니다." });
    } catch (error) {
      res.status(500).json({ message: "서버 에러" });
    }
  },

  // 7. 회원탈퇴
  withdraw: async (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ message: "비밀번호를 입력하세요." });
      }

      // 비밀번호 검증을 위해 password컬럼이 포함된 유저 데이터를 조회
      const user = await userModel.findFullInfoById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
      }

      // DB 데이터 오염 방어
      let dbHash = user.password.trim();
      if (dbHash.endsWith(".")) {
        dbHash = dbHash.slice(0, -1);
      }

      const isMatch = await bcrypt.compare(password, dbHash);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "비밀번호가 일치하지 않습니다." });
      }

      await userModel.deleteUser(req.user.id);
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "회원 탈퇴가 완료되었습니다." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "서버 에러" });
    }
  },
};
