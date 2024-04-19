/**
 * server/database/admin/home/general/list
 *
 * 관리화면 첫페이지 > 그룹, 게시판, 회원에 필요한 함수들
 */

import { AdminUserInfo } from "../../../../../src/interface/admin"
import { table, select } from "../../../common"

// 그룹 목록을 최신 순으로 가져오기
export async function getGroupList(limit: number): Promise<string[]> {
  let result: string[] = []

  const groups = await select(`SELECT id FROM ${table}group ORDER BY uid DESC LIMIT ?`, [
    limit.toString(),
  ])
  if (!groups[0]) {
    return result
  }

  for (const group of groups) {
    result.push(group.id)
  }

  return result
}

// 게시판 목록을 최신 순으로 가져오기
export async function getBoardList(limit: number): Promise<string[]> {
  let result: string[] = []

  const boards = await select(`SELECT id FROM ${table}board ORDER BY uid DESC LIMIT ?`, [
    limit.toString(),
  ])
  if (!boards[0]) {
    return result
  }

  for (const board of boards) {
    result.push(board.id)
  }

  return result
}

// 회원 목록을 최신 순으로 가져오기
export async function getMemberList(limit: number): Promise<AdminUserInfo[]> {
  let result: AdminUserInfo[] = []

  const members = await select(
    `SELECT uid, name, profile FROM ${table}user ORDER BY uid DESC LIMIT ?`,
    [limit.toString()],
  )
  if (!members[0]) {
    return result
  }

  for (const member of members) {
    result.push({
      uid: member.uid,
      name: member.name,
      profile: member.profile,
    })
  }

  return result
}
