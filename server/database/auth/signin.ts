/**
 * server/database/auth/signin
 *
 * 사용자 로그인 처리에 필요한 함수들
 */

import { table, select, update } from "../common"
import { User } from "../../../src/interface/auth"
import { INIT_USER } from "./const"

// 사용자 로그인 시 아이디 비번 확인 및 사용자 정보 반환
export async function userSignIn(id: string, password: string): Promise<User> {
  let result: User = INIT_USER

  const [user] = await select(
    `SELECT uid, id, name, profile, level, point, signature, signup 
      FROM ${table}user 
      WHERE blocked = 0 AND id = ? AND password = ? LIMIT 1`,
    [id, password],
  )
  if (!user) {
    return result
  }

  const signin = Date.now()
  result = {
    uid: user.uid,
    id: user.id,
    name: user.name,
    profile: user.profile,
    level: user.level,
    point: user.point,
    signature: user.signature,
    signup: user.signup,
    signin,
    admin: false,
    token: "",
  }

  await update(
    `UPDATE ${table}user 
      SET signin = ?
      WHERE uid = ? LIMIT 1`,
    [signin, user.uid],
  )
  return result
}
