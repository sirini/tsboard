/**
 * server/database/auth/signup
 *
 * 신규 사용자 추가하기에 필요한 함수들
 */

import { table, select, insert, update } from "../common"
import { Signup } from "../../../src/interface/auth"
import { createTransport } from "nodemailer"
import { MailOptions } from "nodemailer/lib/json-transport"

// 이미 등록된 이메일인지 확인하기 (true -> 이미 등록됨)
export async function isDuplicatedEmail(email: string): Promise<boolean> {
  const [result] = await select(
    `SELECT uid FROM ${table}user 
  WHERE id = ? LIMIT 1`,
    [email],
  )

  if (!result) {
    return false
  }
  return true
}

// 이미 등록된 이름인지 확인하기 (true -> 이미 등록됨)
export async function isDuplicatedName(name: string): Promise<boolean> {
  const [result] = await select(`SELECT uid FROM ${table}user WHERE name = ? LIMIT 1`, [name])
  if (!result) {
    return false
  }
  return true
}

// 랜덤 문자 6개 반환하는 함수, 인증 코드로 활용한다
function generateRandomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz0123456789"
  let random = ""

  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * chars.length)
    random += chars.charAt(index)
  }
  return random
}

// 실제 메일 발송하는 함수, 인증 코드와 링크를 넣어서 발송한다
async function sendMail(uid: number, email: string, code: string, name: string): Promise<void> {
  try {
    const transporter = createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_OAUTH_USER,
        clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
        clientSecret: process.env.GAMIL_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GAMIL_OAUTH_REFRESH_TOKEN,
      },
    })

    const options: MailOptions = {
      from: process.env.GMAIL_OAUTH_USER,
      to: email,
      subject: `[${process.env.SITE_NAME}] ${name}님, 인증 코드를 입력해 주세요!`,
      html: `안녕하세요 <strong>${name}</strong>님!<br />
<br />
회원 가입을 완료하기 위해서 아래의 링크에 인증 코드 6자리를 입력해 주세요!<br />
<br />
<div style="width: 500px; background-color: #f0f0f0; border-radius: 10px; border: 2px solid #ddd; margin-top: 10px; margin-bottom: 10px; padding: 10px; line-height: 170%;">
&middot; 인증 코드 : <strong style="letter-spacing: 5px;">${code}</strong><br />
&middot; 코드 입력 : <a href="${process.env.SITE_URL}${process.env.SITE_TSBOARD_PATH}verify/${uid}" target="_blank">여기를 눌러 위의 인증 코드 입력하기!</a>
</div>
<br />
From <a href="${process.env.SITE_URL}" target="_blank">${process.env.SITE_URL}</a> <span style="color: #888888">&middot; Powered by tsboard.dev</span>
`,
    }

    await transporter.sendMail(options)
  } catch (e: any) {
    console.log(`[signup/sendMail] ${e}`)
  }
}

// 이메일 인증 진행을 위해 메일 발송하기
export async function sendVerificationMail(email: string, name: string): Promise<number> {
  const code = generateRandomCode()
  let uid = 0
  const [result] = await select(
    `SELECT uid, email FROM ${table}user_verification WHERE email = ? LIMIT 1`,
    [email],
  )
  if (!result) {
    uid = await insert(
      `INSERT INTO ${table}user_verification (email, code, timestamp) 
    VALUES (?, ?, ?)`,
      [email, code, Date.now()],
    )
  } else {
    uid = result.uid
    await update(
      `UPDATE ${table}user_verification SET code = ?, timestamp = ? 
    WHERE uid = ? LIMIT 1`,
      [code, Date.now(), uid],
    )
  }
  sendMail(uid, email, code, name)
  return uid
}

// 인증 코드 확인하고 맞을 경우 사용자 등록 완료하기
export async function verify(target: number, code: string, user: Signup): Promise<boolean> {
  const [result] = await select(
    `SELECT code FROM ${table}user_verification 
  WHERE uid = ? LIMIT 1`,
    [target],
  )
  if (!result) {
    return false
  }
  if ((result.code as string) === code) {
    await addNewUser(user)
    return true
  }
  return false
}

// 신규 사용자 등록하기
export async function addNewUser(user: Signup): Promise<boolean> {
  const insertId = await insert(
    `INSERT INTO ${table}user 
  (id, name, password, profile, level, point, signature, signup, signin, blocked) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user.email, user.name, user.password, "", 0, 0, "", Date.now(), 0, 0],
  )
  if (insertId > 1) {
    return true
  }
  return false
}
