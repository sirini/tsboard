/**
 * server/database/auth/signup
 *
 * 신규 사용자 추가하기에 필요한 함수들
 */

import { table, select, insert } from "../common"
import { Signup } from "../../../src/interface/auth"

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
