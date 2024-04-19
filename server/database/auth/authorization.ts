/**
 * server/database/auth/token
 *
 * 사용자 인증에 필요한 토큰 관련 함수들
 */

import { table, select, update, insert } from "../common"
import { Token } from "../../../src/interface/auth"

// 로그인 성공 시점에 생성된 access, refresh 토근을 DB에 저장
export async function saveTokens(userUid: number, token: Token): Promise<void> {
  const userUidQuery = userUid.toString()
  const [row] = await select(`SELECT user_uid FROM ${table}user_token WHERE user_uid = ? LIMIT 1`, [
    userUidQuery,
  ])
  const now = Date.now().toString()
  if (!row) {
    await insert(
      `INSERT INTO ${table}user_token (user_uid, access, refresh, timestamp_access, timestamp_refresh) 
        VALUES (?, ?, ?, ?, ?)`,
      [userUidQuery, token.access, token.refresh, now, now],
    )
  } else {
    await update(
      `UPDATE ${table}user_token SET 
        access = ?, 
        refresh = ?, 
        timestamp_access = ?, 
        timestamp_refresh = ? 
        WHERE user_uid = ? LIMIT 1`,
      [token.access, token.refresh, now, now, userUidQuery],
    )
  }
}

// access token 만료 시 리프레시 토큰이 유효한지 확인
export async function isValidRefreshToken(userUid: number, refresh: string): Promise<boolean> {
  if (refresh.length < 1) {
    return false
  }
  const [token] = await select(
    `SELECT refresh FROM ${table}user_token WHERE user_uid = ? LIMIT 1`,
    [userUid.toString()],
  )
  if (!token) {
    return false
  }
  if ((token.refresh as string) === refresh) {
    return true
  }
  return false
}
