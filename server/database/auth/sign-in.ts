/**
 * server/database/auth/sign-in
 *
 * 사용자 로그인 처리에 필요한 함수들
 */
import { table, select, update, insert } from "../common"
import { SignIn, Token } from "../../interface/auth"

// 사용자 로그인 시 아이디 비번 확인 및 사용자 정보 반환
export async function userSignIn(id: string, password: string): Promise<SignIn> {
  let result: SignIn = {
    uid: 0,
    name: "",
    profile: "",
    level: 0,
    point: 0,
    signature: "",
    signup: 0,
    signin: 0,
  }

  const [user] = await select(
    `SELECT uid, name, profile, level, point, signature, signup 
      FROM ${table}user 
      WHERE blocked = 0 AND id = ? AND password = ? LIMIT 1`,
    [id, password],
  )
  if (!user[0]) {
    return result
  }

  const signin = Date.now()
  result = {
    uid: user[0].uid,
    name: user[0].name,
    profile: user[0].profile,
    level: user[0].level,
    point: user[0].point,
    signature: user[0].signature,
    signup: user[0].signup,
    signin,
  }
  await update(
    `UPDATE ${table}user 
      SET signin = ?
      WHERE uid = ? LIMIT 1`,
    [signin, user[0].uid],
  )
  return result
}

// 로그인 성공 시점에 생성된 access, refresh 토근을 DB에 저장
export async function saveTokens(userUid: number, token: Token): Promise<void> {
  const [row] = await select(`SELECT user_uid FROM ${table}user_token WHERE user_uid = ? LIMIT 1`, [
    userUid,
  ])
  const now = Date.now()
  if (!row[0]) {
    await insert(
      `INSERT INTO ${table}user_token (user_uid, access, refresh, timestamp_access, timestamp_refresh) 
        VALUES (?, ?, ?, ?, ?)`,
      [userUid, token.access, token.refresh, now, now],
    )
  } else {
    await update(
      `UPDATE ${table}user_token SET 
        access = ?, 
        refresh = ?, 
        timestamp_access = ?, 
        timestamp_refresh = ? 
        WHERE user_uid = ? LIMIT 1`,
      [token.access, token.refresh, now, now],
    )
  }
}
