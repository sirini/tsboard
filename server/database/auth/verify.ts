/**
 * server/database/auth/verify
 *
 * 인증 코드를 추가 혹은 업데이트 하는 함수 정의
 */

import { table, select, insert, update } from "../common"

// 이메일 인증, 비밀번호 초기화 등에 필요한 인증 코드 추가/업데이트
export async function prepareVerificationCode(code: string, email: string): Promise<number> {
  let uid = 0
  const [result] = await select(
    `SELECT uid, email FROM ${table}user_verification WHERE email = ? LIMIT 1`,
    [email],
  )
  if (!result) {
    uid = await insert(
      `INSERT INTO ${table}user_verification (email, code, timestamp) 
    VALUES (?, ?, ?)`,
      [email, code, Date.now().toString()],
    )
  } else {
    uid = result.uid
    await update(
      `UPDATE ${table}user_verification SET code = ?, timestamp = ? 
    WHERE uid = ? LIMIT 1`,
      [code, Date.now().toString(), uid.toString()],
    )
  }
  return uid
}
