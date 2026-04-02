const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// 누구나 접근 가능(Public)
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken); // 쿠키 기반으로 처리

/* 
  이 줄 아래에 있는 모든 라우터는
  자동으로 authMiddleware를 거치게 됨.
  AccessToken이 유효한 사람만 접근 가능(Private) 
*/
router.use(authMiddleware);

router.get("/me", authController.getMe);
router.patch("/nickname", authController.updateNickname);
router.post("/logout", authController.logout);
router.post("/withdraw", authController.withdraw);

module.exports = router;
