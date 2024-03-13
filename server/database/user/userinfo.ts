/**
 * server/database/user/userinfo
 *
 * 회원 기본 정보 가져오기 등에 필요한 함수들
 */

import { table, select } from "../common"
import { UserOpenInfo } from "../../../src/interface/user"
import { USER_OPEN_INFO } from "./const"
import { haveAdminPermission } from "./manageuser"

// 주어진 회원 번호에 해당하는 회원의 기본 정보들 가져오기
export async function getUserOpenInfo(userUid: number): Promise<UserOpenInfo> {
  let result = USER_OPEN_INFO
  const [user] = await select(
    `SELECT name, profile, level, signature, signup, signin, blocked 
  FROM ${table}user WHERE uid = ? LIMIT 1`,
    [userUid],
  )
  if (!user) {
    return result
  }

  const admin = await haveAdminPermission(userUid)
  result = {
    uid: userUid,
    name: user.name,
    profile: user.profile,
    level: user.level,
    signature: user.signature,
    signup: user.signup,
    signin: user.signin,
    admin,
    blocked: user.blocked > 0 ? true : false,
  }

  return result
}
