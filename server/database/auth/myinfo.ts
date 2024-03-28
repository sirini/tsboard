/**
 * server/database/auth/myinfo
 *
 * 일반 사용자의 내 정보 보기 관련 처리
 */

import { User } from "../../../src/interface/auth"
import { table, select } from "../common"
import { haveAdminPermission } from "../user/manageuser"
import { INIT_USER } from "./const"

// 내 정보 가져오기
export async function getUser(userUid: number): Promise<User> {
  let result: User = INIT_USER
  const [user] = await select(
    `SELECT id, name, profile, level, point, signature, signup, signin FROM ${table}user WHERE uid = ? AND blocked = 0`,
    [userUid],
  )
  if (!user) {
    return result
  }

  const [token] = await select(`SELECT access FROM ${table}user_token WHERE user_uid = ? LIMIT 1`, [
    userUid,
  ])
  if (!token) {
    return result
  }

  const admin = await haveAdminPermission(userUid)

  return {
    uid: userUid,
    id: user.id,
    name: user.name,
    profile: user.profile,
    level: user.level,
    point: user.point,
    signature: user.signature,
    signup: user.signup,
    signin: user.signin,
    admin,
    token: token.access,
  }
}
