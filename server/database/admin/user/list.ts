/**
 * server/database/admin/user/list
 *
 * 회원 목록 관리와 관련된 것들 처리
 */

import { RowDataPacket } from "mysql2"
import { AdminUser, AdminUserParams } from "../../../../src/interface/admin"
import { select, table } from "../../common"

// 총 회원수 반환하기
export async function getTotalUserCount(isBlocked: boolean): Promise<number> {
  const [total] = await select(
    `SELECT uid FROM ${table}user WHERE blocked ${
      isBlocked ? "=" : "<"
    } 1 ORDER BY uid DESC LIMIT 1`,
  )
  if (!total) {
    return 0
  }
  return total.uid
}

// (검색된) 유저들을 정리하여 반환하기
async function makeUserResult(users: RowDataPacket[]): Promise<AdminUser[]> {
  let result: AdminUser[] = []
  for (const user of users) {
    result.push({
      uid: user.uid,
      id: user.id,
      name: user.name,
      profile: user.profile,
      level: user.level,
      point: user.point,
      signup: user.signup,
    })
  }
  return result
}

// 회원 목록 가져오기
export async function getUsers(param: AdminUserParams): Promise<AdminUser[]> {
  let result: AdminUser[] = []
  const last = 1 + param.total - (param.page - 1) * param.bunch
  const users = await select(
    `SELECT uid, id, name, profile, level, point, signup FROM ${table}user WHERE uid < ${last} AND blocked ${
      param.isBlocked ? "=" : "<"
    } 1 ORDER BY uid DESC LIMIT ${param.bunch}`,
  )
  if (!users[0]) {
    return result
  }
  result = await makeUserResult(users)
  return result
}

// 회원 검색 결과 가져오기
export async function getSearchedUsers(search: AdminUserParams): Promise<AdminUser[]> {
  let result: AdminUser[] = []
  const last = 1 + search.total - (search.page - 1) * search.bunch
  let where = ""
  if (search.option === "level") {
    where = `level = ${search.keyword}`
  } else {
    where = `${search.option} LIKE '%${search.keyword}%'`
  }
  const users = await select(`SELECT uid, id, name, profile, level, point, signup FROM ${table}user
  WHERE uid < ${last} AND blocked ${
    search.isBlocked ? "=" : "<"
  } 1 AND ${where} ORDER BY uid DESC LIMIT ${search.bunch}`)
  if (!users[0]) {
    return result
  }
  result = await makeUserResult(users)
  return result
}
