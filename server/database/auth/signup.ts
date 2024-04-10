/**
 * server/database/auth/signup
 *
 * 신규 사용자 추가하기에 필요한 함수들
 */

import { table, select, insert } from "../common"
import { prepareVerificationCode } from "./verify"
import { Signup } from "../../../src/interface/auth"
import { generateRandomCode } from "../../util/tools"
import { sendMail } from "../../util/sendmail"
import { TEXT } from "../../../src/messages/mail/verification"
import { NEW_MEMBER } from "../../../tsboard.config"
import { LangType } from "../../../src/interface/home"

// 이미 등록된 이메일인지 확인하기 (true -> 이미 등록됨)
export async function isDuplicatedEmail(email: string): Promise<boolean> {
  const [result] = await select(`SELECT uid FROM ${table}user WHERE id = ? LIMIT 1`, [email])
  if (!result) {
    return false
  }
  return true
}

// 이미 등록된 이름인지 확인하기 (true -> 이미 등록됨)
export async function isDuplicatedName(userUid: number, name: string): Promise<boolean> {
  const [result] = await select(
    `SELECT uid FROM ${table}user WHERE uid != ${userUid} AND name = '${name}' LIMIT 1`,
  )
  if (!result) {
    return false
  }
  return true
}

// 이메일 인증 진행을 위해 메일 발송하기
export async function sendVerificationMail(
  email: string,
  name: string,
  lang: LangType,
): Promise<number> {
  const code = generateRandomCode()
  const uid = await prepareVerificationCode(code, email)

  const subject = TEXT[lang].SUBJECT.replace("#name#", name)
  let html = TEXT[lang].HTML.replaceAll("#name#", name)
  html = html.replaceAll("#code#", code)
  html = html.replaceAll("#uid#", uid.toString())

  await sendMail(email, subject, html)
  return uid
}

// 인증 코드 확인하고 맞을 경우 사용자 등록 완료하기
export async function verify(target: number, code: string, user: Signup): Promise<boolean> {
  const [result] = await select(
    `SELECT code FROM ${table}user_verification WHERE uid = ? LIMIT 1`,
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
    [
      user.email,
      user.name,
      user.password,
      "",
      NEW_MEMBER.LEVEL,
      NEW_MEMBER.POINT,
      "",
      Date.now(),
      0,
      0,
    ],
  )
  if (insertId > 1) {
    return true
  }
  return false
}
