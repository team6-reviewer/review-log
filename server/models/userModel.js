const conn = require("../config/db");

module.exports = {
  // 1. username(로그인 아이디)로 유저 찾기
  findByUsername: async (username) => {
    const sql = `SELECT id, username, password, nickname FROM user_table WHERE username = ?`;
    const [rows] = await conn.execute(sql, [username]);
    return rows[0]; // 없으면 undefined 반환
  },

  // 2. nickname으로 유저 찾기
  findByNickname: async (nickname) => {
    const sql = `SELECT id, nickname FROM user_table WHERE nickname = ?`;
    const [rows] = await conn.execute(sql, [nickname]);
    return rows[0];
  },

  // 3. 유저 고유번호(PK)로 기본 유저 정보 찾기
  findById: async (id) => {
    const sql = `SELECT id, username, nickname, refreshtoken, createdat FROM user_table WHERE id = ?`;
    const [rows] = await conn.execute(sql, [id]);
    return rows[0];
  },

  // 4.  유저 고유번호(PK)로 비밀번호를 포함한 전체 정보 찾기 (회원탈퇴 검증용)
  findFullInfoById: async (id) => {
    const sql = `SELECT id, username, password, nickname FROM user_table WHERE id = ?`;
    const [rows] = await conn.execute(sql, [id]);
    return rows[0];
  },

  // 5. 회원 등록
  createUser: async (username, hashedPassword, nickname) => {
    const sql = `INSERT INTO user_table (username, password, nickname) VALUES (?, ?, ?)`;
    const [result] = await conn.execute(sql, [
      username,
      hashedPassword,
      nickname,
    ]);
    return result.insertId; // 새로 생성된 PK 반환
  },

  // 6. 리프레시 토큰 갱신 및 삭제
  updateRefreshToken: async (id, refreshToken) => {
    const sql = `UPDATE user_table SET refreshtoken = ? WHERE id = ?`;
    await conn.execute(sql, [refreshToken, id]);
  },

  // 7. 닉네임 수정
  updateNickname: async (id, nickname) => {
    const sql = `UPDATE user_table SET nickname = ? WHERE id = ?`;
    await conn.execute(sql, [nickname, id]);
  },

  // 8. 회원 탈퇴
  deleteUser: async (id) => {
    const sql = `DELETE FROM user_table WHERE id = ?`;
    await conn.execute(sql, [id]);
  },
};
