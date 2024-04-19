/**
 * server/database/auth/logout
 *
 * 사용자 로그아웃 처리에 필요한 함수들
 */

import { table, update } from "../common"

// 사용자 로그아웃 시 토큰 정보 비워주기
export async function clearUserToken(userUid: number): Promise<void> {
  if (userUid < 1) {
    return
  }

  await update(
    `UPDATE ${table}user_token 
  SET access = ?, refresh = ?, timestamp_access = ?, timestamp_refresh = ?
  WHERE user_uid = ? LIMIT 1`,
    ["", "", "0", "0", userUid.toString()],
  )
}
