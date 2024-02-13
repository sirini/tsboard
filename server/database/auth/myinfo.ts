/**
 * server/database/auth/myinfo
 *
 * 일반 사용자의 내 정보 보기 관련 처리
 */

import { User } from "../../../src/interface/auth"
import { table, select } from "../common"

// 내 정보 가져오기
export async function getUser(userUid: number): Promise<User> {
  let result: User = {
    uid: userUid,
    id: "",
    name: "",
    profile: "",
    level: 0,
    point: 0,
    signature: "",
    signup: 0,
    signin: 0,
    admin: userUid === 1 ? true : false,
    token: "",
  }
  const [user] = await select(
    `SELECT id, name, profile, level, point, signature, signup, signin FROM ${table}user WHERE uid = ? AND blocked = 0`,
    [userUid],
  )
  if (!user) {
    return result
  }
  result.id = user.id
  result.name = user.name
  result.profile = user.profile
  result.level = user.level
  result.point = user.point
  result.signature = user.signature
  result.signup = user.signup
  result.signin = user.signin

  const [token] = await select(`SELECT access FROM ${table}user_token WHERE user_uid = ? LIMIT 1`, [
    userUid,
  ])
  if (!token) {
    return result
  }
  result.token = token.access
  return result
}
