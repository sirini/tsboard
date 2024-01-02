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
export async function askResetPassword(email: string): Promise<void> {
  const fromUid = await getUserUid(email)
  const note = `[resetpassword] 비밀번호 초기화 요청 (회원 번호: ${fromUid} / 아이디: ${email})
관리 화면에서 비밀번호를 임시로 초기화 해주세요. (${process.env.SITE_URL}${process.env.SITE_TSBOARD_PATH}admin/member/${fromUid})  
이후 초기화한 비밀번호를 ${email} (으)로 전달해 주세요!
`
  await insert(
    `INSERT INTO ${table}note (to_uid, from_uid, note, timestamp) 
  VALUES (?, ?, ?, ?)`,
    [1, fromUid, note, Date.now()],
  )
}

// 메일로 비밀번호 초기화 링크 전달하기
export async function sendResetPassword(email: string): Promise<void> {
  const code = generateRandomCode()
  const uid = await prepareVerificationCode(code, email)

  const subject = `[${process.env.SITE_NAME}] 비밀번호 초기화 안내드립니다.`
  const html = `${process.env.SITE_NAME} 회원님, 비밀번호 초기화 관련해서 안내드립니다.<br />
<br />
혹시 비밀번호 초기화를 요청하신 적이 없다면, 본 메일을 무시해 주세요!<br />
(아래 제공되는 링크를 클릭하지 마시고, 이 메일은 삭제하시면 됩니다.)<br />
<br />
만약 비밀번호 초기화를 요청하신 게 맞다면, 아래 제공되는 초기화 링크를 통해서<br />
직접 비밀번호를 변경하실 수 있습니다.<br />
<br />
<div style="width: 500px; background-color: #f0f0f0; border-radius: 10px; border: 2px solid #ddd; margin-top: 10px; margin-bottom: 10px; padding: 10px; line-height: 170%;">
&middot; 링크 : <a href="${process.env.SITE_URL}${process.env.SITE_TSBOARD_PATH}changepassword/${uid}/${code}" target="_blank">여기를 눌러 비밀번호 초기화 하기!</a>
</div>
<br />
From <a href="${process.env.SITE_URL}" target="_blank">${process.env.SITE_URL}</a> <span style="color: #888888">&middot; Powered by tsboard.dev</span>
`
  await sendMail(email, subject, html)
}

// 비밀번호 변경하기
export async function changePassword(user: ChangePassword): Promise<boolean> {
  const [result] = await select(
    `SELECT email, code FROM ${table}user_verification WHERE uid = ? LIMIT 1`,
    [user.target],
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
    userUid,
  ])
  return true
}
