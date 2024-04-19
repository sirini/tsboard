/**
 * server/database/admin/group/general/load
 *
 * 그룹 관리 > 일반 > 불러오기에 필요한 함수들
 */

import { table, select } from "../../../common"
import {
  AdminGroupConfig,
  AdminGroupList,
  AdminPair,
  AdminUserInfo,
} from "../../../../../src/interface/admin"
import { INIT_GROUP_CONFIG } from "./const"

// 주어진 아이디에 해당하는 그룹 설정 가져오기
export async function getGroupConfig(id: string): Promise<AdminGroupConfig> {
  let result: AdminGroupConfig = INIT_GROUP_CONFIG
  const [group] = await select(`SELECT uid, admin_uid FROM ${table}group WHERE id = ? LIMIT 1`, [
    id,
  ])
  if (!group) {
    return result
  }

  const [admin] = await select(`SELECT id, name, profile FROM ${table}user WHERE uid = ? LIMIT 1`, [
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
      name: `${admin.name} (${admin.id})`,
      profile: admin.profile,
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
    [groupUid.toString()],
  )
  if (!boards[0]) {
    return result
  }

  for (const board of boards) {
    const [admin] = await select(
      `SELECT name, id, profile FROM ${table}user WHERE uid = ? LIMIT 1`,
      [board.admin_uid],
    )
    let manager: AdminUserInfo = {
      uid: 0,
      name: "",
      profile: "",
    }
    if (admin) {
      manager = {
        uid: board.admin_uid,
        name: `${admin.name} (${admin.id})`,
        profile: admin.profile,
      }
    }

    const [post] = await select(
      `SELECT COUNT(*) AS total_count FROM ${table}post WHERE board_uid = ?`,
      [board.uid],
    )
    const [comment] = await select(
      `SELECT COUNT(*) AS total_count FROM ${table}comment WHERE board_uid = ?`,
      [board.uid],
    )
    const [file] = await select(
      `SELECT COUNT(*) AS total_count FROM ${table}file WHERE board_uid = ?`,
      [board.uid],
    )
    const [image] = await select(
      `SELECT COUNT(*) AS total_count FROM ${table}image WHERE board_uid = ?`,
      [board.uid],
    )

    result.push({
      uid: board.uid,
      id: board.id,
      name: board.name,
      info: board.info,
      manager,
      total: {
        post: post.total_count,
        comment: comment.total_count,
        file: file.total_count,
        image: image.total_count,
      },
    })
  }

  return result
}

// 그룹 관리자 후보 목록 가져오기
export async function getGroupAdminCandidates(
  name: string,
  limit: number,
): Promise<AdminUserInfo[]> {
  let result: AdminUserInfo[] = []
  const users = await select(
    `SELECT uid, id, name, profile FROM ${table}user WHERE blocked = 0 AND name LIKE '%${name}%' LIMIT ${limit}`,
  )

  if (!users[0]) {
    return result
  }

  for (const user of users) {
    result.push({
      uid: user.uid,
      name: `${user.name} (${user.id})`,
      profile: user.profile,
    })
  }

  return result
}

// 기존 게시판 아이디들 목록 가져오기 (중복복인지 알려주기 위함)
export async function getExistBoardIds(id: string, limit: number): Promise<AdminPair[]> {
  let result: AdminPair[] = []
  const ids = await select(
    `SELECT uid, id, name FROM ${table}board WHERE id LIKE '%${id}%' LIMIT ${limit}`,
  )

  if (!ids[0]) {
    return result
  }

  for (const id of ids) {
    result.push({ uid: id.uid, name: `${id.id} (${id.name})` })
  }

  return result
}
