/**
 * server/database/auth/token
 *
 * 사용자 인증에 필요한 토큰 관련 함수들
 */

import { table, select, update, insert } from "../common"
import { Token } from "../../../src/interface/auth"

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
      [token.access, token.refresh, now, now, userUid],
    )
  }
}

// access token 만료 시 (다른 브라우저에서) 이미 로그아웃 처리되었는지 한 번 더 확인
export async function isLoggedOut(userUid: number): Promise<boolean> {
  const [row] = await select(
    `SELECT timestamp_access FROM ${table}user_token WHERE user_uid = ? LIMIT 1`,
    [userUid],
  )
  if (!row) {
    return true /* never logged in */
  }
  if (row.timestamp_access > 0) {
    return false /* still logged in */
  }
  return true
}
