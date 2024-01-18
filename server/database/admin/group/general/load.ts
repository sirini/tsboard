/**
 * server/database/admin/group/general/load
 *
 * 그룹 관리 > 일반 > 불러오기에 필요한 함수들
 */

import { table, select } from "../../../common"
import { AdminGroupConfig, AdminGroupList, AdminPairItem } from "../../../../../src/interface/admin"

// 주어진 아이디에 해당하는 그룹 설정 가져오기
export async function getGroupConfig(id: string): Promise<AdminGroupConfig> {
  let result: AdminGroupConfig = {
    uid: 0,
    id: "",
    count: 0,
    manager: {
      uid: 0,
      name: "",
    },
  }

  const [group] = await select(`SELECT uid, admin_uid FROM ${table}group WHERE id = ? LIMIT 1`, [
    id,
  ])
  if (!group) {
    return result
  }

  const [admin] = await select(`SELECT name FROM ${table}user WHERE uid = ? LIMIT 1`, [
    group.admin_uid,
  ])
  if (!admin) {
    return result
  }

  result = {
    uid: group.uid,
    id,
    count: 0,
    manager: {
      uid: group.admin_uid,
      name: admin.name,
    },
  }

  const [board] = await select(
    `SELECT COUNT(*) as total_count FROM ${table}board WHERE group_uid = ?`,
    [group.uid],
  )
  if (!board) {
    return result
  }
  result.count = board.total_count

  return result
}

// 주어진 그룹 번호에 해당하는 게시판 목록들 가져오기
export async function getGroupBoards(groupUid: number): Promise<AdminGroupList[]> {
  let result: AdminGroupList[] = []

  const boards = await select(
    `SELECT uid, id, admin_uid, name, info FROM ${table}board WHERE group_uid = ?`,
    [groupUid],
  )
  if (!boards[0]) {
    return result
  }

  for (const board of boards) {
    const [admin] = await select(
      `SELECT name, id, profile FROM ${table}user WHERE uid = ? LIMIT 1`,
      [board.admin_uid],
    )
    let manager: AdminPairItem = {
      uid: 0,
      name: "",
    }
    if (admin) {
      manager = {
        uid: board.admin_uid,
        name: `${admin.name} (${admin.id})`,
        profile: admin.profile === "" ? "/no-profile.png" : "",
      }
    }

    result.push({
      uid: board.uid,
      id: board.id,
      name: board.name,
      info: board.info,
      manager,
    })
  }

  return result
}
