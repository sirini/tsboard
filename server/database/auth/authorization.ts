/**
 * server/database/auth/token
 *
 * 사용자 인증에 필요한 토큰 관련 함수들
 */

import { AUTH } from "../../../tsboard.config"
import { table, select, update, insert } from "../common"
import { SHA256 } from "crypto-js"

// 로그인 성공 시점에 생성된 refresh 토근을 DB에 저장
export async function saveTokens(userUid: number, refreshToken: string): Promise<void> {
  const userUidQuery = userUid.toString()
  const [row] = await select(`SELECT user_uid FROM ${table}user_token WHERE user_uid = ? LIMIT 1`, [
    userUidQuery,
  ])
  const now = Date.now().toString()
  const hashedToken = SHA256(refreshToken).toString()

  if (!row) {
    await insert(`INSERT INTO ${table}user_token (user_uid, refresh, timestamp) VALUES (?, ?, ?)`, [
      userUidQuery,
      hashedToken,
      now,
    ])
  } else {
    await update(
      `UPDATE ${table}user_token SET refresh = ?, timestamp = ? WHERE user_uid = ? LIMIT 1`,
      [hashedToken, now, userUidQuery],
    )
  }
}

// access token 만료 시 리프레시 토큰이 유효한지 확인
export async function isValidRefreshToken(userUid: number, refresh: string): Promise<boolean> {
  if (refresh.length < 1) {
    return false
  }
  const [token] = await select(
    `SELECT refresh, timestamp FROM ${table}user_token WHERE user_uid = ? LIMIT 1`,
    [userUid.toString()],
  )
  if (!token) {
    return false
  }

  const availableTime = AUTH.JWT.REFRESH_TIMEOUT * 24 * 60 * 60 * 1000
  if (token.timestamp + availableTime < Date.now()) {
    return false
  }

  const hashedToken = SHA256(refresh).toString()
  if ((token.refresh as string) === hashedToken) {
    return true
  }
  return false
}

// 사용자 세션 검사
export async function checkUserVerification(
  userUid: number,
  accessToken: string,
  refreshToken: string,
): Promise<boolean> {
  // TODO
  return false
}
