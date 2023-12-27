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
    id: "",
    name: "",
    profile: "",
    level: 0,
    point: 0,
    signature: "",
    signup: 0,
    signin: 0,
  }

  const [user] = await select(
    `SELECT uid, id, name, profile, level, point, signature, signup 
      FROM ${table}user 
      WHERE blocked = 0 AND id = ? AND password = ? LIMIT 1`,
    [id, password],
  )
  if (!user) {
    return result
  }

  const signin = Date.now()
  result = {
    uid: user.uid,
    id: user.id,
    name: user.name,
    profile: user.profile,
    level: user.level,
    point: user.point,
    signature: user.signature,
    signup: user.signup,
    signin,
  }
  await update(
    `UPDATE ${table}user 
      SET signin = ?
      WHERE uid = ? LIMIT 1`,
    [signin, user.uid],
  )
  return result
}

// 로그인 성공 시점에 생성된 access, refresh 토근을 DB에 저장
export async function saveTokens(userUid: number, token: Token): Promise<void> {
  const [row] = await select(`SELECT user_uid FROM ${table}user_token WHERE user_uid = ? LIMIT 1`, [
    userUid,
  ])
  const now = Date.now()
  if (!row) {
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
