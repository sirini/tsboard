/**
 * server/database/auth/myinfo
 *
 * 일반 사용자의 내 정보 보기 관련 처리
 */

import { User } from "../../../src/interface/auth"
import { table, select } from "../common"
import { NO_TABLE_TARGET } from "../user/const"
import { haveAdminPermission } from "../user/manageuser"
import { INIT_USER } from "./const"

// 내 정보 가져오기
export async function getUser(userUid: number): Promise<User> {
  let result: User = INIT_USER
  const [user] = await select(
    `SELECT id, name, profile, level, point, signature, signup, signin FROM ${table}user WHERE uid = ? AND blocked = 0`,
    [userUid.toString()],
  )
  if (!user) {
    return result
  }

  const admin = await haveAdminPermission(userUid, NO_TABLE_TARGET)
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
    token: "" /* 로그인 시점에 생성된 액세스 토큰을 받아서 따로 저장 */,
  }
}
