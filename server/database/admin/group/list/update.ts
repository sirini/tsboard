/**
 * server/database/admin/group/list/update
 *
 * 게시판 그룹 관리에 필요한 함수들
 */

import { AdminPairItem } from "../../../../../src/interface/admin"
import { table, update, insert, select, remove } from "../../../common"

// 새 그룹 만들기
export async function createGroup(id: string): Promise<number> {
  let newGroupUid = 0
  newGroupUid = await insert(
    `INSERT INTO ${table}group (id, admin_uid, timestamp) VALUES (?, ?, ?)`,
    [id, 1, Date.now()],
  )
  return newGroupUid
}

// 기본 관리자 정보 가져오기
export async function getAdminInfo(): Promise<AdminPairItem> {
  let result: AdminPairItem = {
    uid: 0,
    name: "",
  }
  const [admin] = await select(`SELECT id, name, profile FROM ${table}user WHERE uid = 1 LIMIT 1`)
  if (!admin) {
    return result
  }
  result = {
    uid: 1,
    name: admin.name,
    profile: admin.profile,
  }
  return result
}

// 지정된 게시판 그룹 삭제하고 소속 게시판들의 그룹을 기본 그룹으로 변경
export async function removeGroup(groupUid: number): Promise<boolean> {
  const [group] = await select(`SELECT COUNT(*) AS total_count FROM ${table}group`)
  if (group.total_count < 2) {
    return false
  }
  const [defaultGroup] = await select(
    `SELECT uid FROM ${table}group WHERE uid != ? ORDER BY uid DESC LIMIT 1`,
    [groupUid],
  )
  await update(`UPDATE ${table}board SET group_uid = ? WHERE group_uid = ?`, [
    defaultGroup.uid,
    groupUid,
  ])
  await remove(`DELETE FROM ${table}group WHERE uid = ? LIMIT 1`, [groupUid])
  return true
}
