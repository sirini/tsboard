/**
 * server/database/auth/resetpassword
 *
 * 비밀번호 초기화에 필요한 함수들
 */

import { table, select, insert, update } from "../common"
import { generateRandomCode } from "../../util/tools"
import { prepareVerificationCode } from "./verify"
import { sendMail } from "../../util/sendmail"
import { ChangePassword } from "../../../src/interface/auth"
import { TEXT } from "../../../src/messages/mail/resetpassword"
import { LangType } from "../../../src/interface/home"

// 이메일(아이디)로 회원 고유 번호 가져오기
async function getUserUid(email: string): Promise<number> {
  const [user] = await select(`SELECT uid FROM ${table}user WHERE id = ? LIMIT 1`, [email])
  if (!user) {
    return 0
  }
  return user.uid
}

// 이미 등록되어 있는 이메일(아이디)인지 확인
export async function isValidEmail(email: string): Promise<boolean> {
  const userUid = await getUserUid(email)
  if (userUid > 0) {
    return true
  }
  return false
}

// GMAIL OAUTH 등록이 안되어 있을경우 사이트 관리자에게 쪽지 보내기
export async function askResetPassword(email: string, lang: LangType): Promise<void> {
  const fromUid = await getUserUid(email)
  let message = TEXT[lang].CHAT.replaceAll("#fromUid#", fromUid.toString())
  message = message.replaceAll("#email#", email)

  await insert(
    `INSERT INTO ${table}chat (to_uid, from_uid, message, timestamp) 
  VALUES (?, ?, ?, ?)`,
    ["1", fromUid.toString(), message, Date.now().toString()],
  )
}

// 메일로 비밀번호 초기화 링크 전달하기
export async function sendResetPassword(email: string, lang: LangType): Promise<void> {
  const code = generateRandomCode()
  const uid = await prepareVerificationCode(code, email)
  let html = TEXT[lang].HTML.replaceAll("#uid#", uid.toString())
  html = html.replaceAll("#code#", code)

  await sendMail(email, TEXT[lang].SUBJECT, html)
}

// 비밀번호 변경하기
export async function changePassword(user: ChangePassword): Promise<boolean> {
  const [result] = await select(
    `SELECT email, code FROM ${table}user_verification WHERE uid = ? LIMIT 1`,
    [user.target.toString()],
  )
  if (!result) {
    return false
  }
  const userUid = await getUserUid(result.email)
  if (!userUid) {
    return false
  }
  if (user.code !== result.code) {
    return false
  }
  await update(`UPDATE ${table}user SET password = ? WHERE uid = ? LIMIT 1`, [
    user.password,
    userUid.toString(),
  ])
  return true
}
