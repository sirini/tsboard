/**
 * server/database/admin/board/permission/load
 *
 * 게시판 관리 > 권한 > 불러오기에 필요한 함수들
 */

import { table, select } from "../../../common"
import { AdminBoardPermission, AdminPairItem } from "../../../../../src/interface/admin"

// 게시판 관리 권한 부분 필요 정보들 가져오기
export async function getBoardPermission(id: string): Promise<AdminBoardPermission> {
  let result: AdminBoardPermission = {
    uid: 0,
    id,
    admin: {
      uid: 0,
      name: "",
      profile: "/no-profile.png",
    },
    level: {
      list: 0,
      view: 0,
      write: 0,
      comment: 0,
      download: 0,
    },
  }

  const [board] = await select(
    `SELECT uid, admin_uid, level_list, level_view, level_write, level_comment, level_download 
  FROM ${table}board WHERE id = ? LIMIT 1`,
    [id],
  )
  if (!board) {
    return result
  }

  result = {
    uid: board.uid,
    id,
    admin: {
      uid: 0,
      name: "",
      profile: "",
    },
    level: {
      list: board.level_list,
      view: board.level_view,
      write: board.level_write,
      comment: board.level_comment,
      download: board.level_download,
    },
  }

  const [admin] = await select(`SELECT id, name, profile FROM ${table}user WHERE uid = ? LIMIT 1`, [
    board.admin_uid,
  ])
  if (!admin) {
    return result
  }

  result.admin = {
    uid: board.admin_uid,
    name: `${admin.name} (${admin.id})`,
    profile: admin.profile === "" ? "/no-profile.png" : admin.profile,
  }

  return result
}

// 신규 관리자 후보 목록 반환하기
export async function getAdminCandidates(name: string, limit: number): Promise<AdminPairItem[]> {
  let result: AdminPairItem[] = []

  const users = await select(
    `SELECT uid, id, name FROM ${table}user WHERE name LIKE '%${name}%' LIMIT ${limit}`,
  )

  if (!users[0]) {
    return result
  }

  for (const user of users) {
    result.push({ uid: user.uid, name: `${user.name} (${user.id})` })
  }

  return result
}
