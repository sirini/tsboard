/**
 * server/database/admin/group/list/load
 *
 * 게시판 그룹 목록 > 불러오기에 필요한 함수들
 */

import { table, select } from "../../../common"
import { AdminGroupConfig, AdminPair, AdminUserInfo } from "../../../../../src/interface/admin"
import { getUserBasic } from "../../../board/list"

// 게시판 그룹 목록 가져오기
export async function getGroupList(): Promise<AdminGroupConfig[]> {
  let result: AdminGroupConfig[] = []
  const groups = await select(`SELECT uid, id, admin_uid FROM ${table}group`)
  for (const group of groups) {
    const manager = await getUserBasic(group.admin_uid)
    const [bc] = await select(
      `SELECT COUNT(*) AS board_count FROM ${table}board WHERE group_uid = ?`,
      [group.uid],
    )
    result.push({
      uid: group.uid,
      id: group.id,
      count: bc.board_count,
      manager: manager as AdminUserInfo,
    })
  }

  return result
}

// 기존의 게시판 그룹 ID들 가져오기
export async function getExistGroupIds(id: string, limit: number): Promise<AdminPair[]> {
  let result: AdminPair[] = []
  const ids = await select(
    `SELECT uid, id FROM ${table}group WHERE id LIKE '%${id}%' LIMIT ${limit}`,
  )
  if (!ids[0]) {
    return result
  }

  for (const id of ids) {
    result.push({ uid: id.uid, name: id.id })
  }

  return result
}
