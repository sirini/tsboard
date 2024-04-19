/**
 * server/database/admin/board/general/load
 *
 * 게시판 관리 > 일반 > 불러오기에 필요한 함수들
 */

import { table, select } from "../../../common"
import { AdminBoardConfig, AdminPair } from "../../../../../src/interface/admin"
import { INIT_BOARD_CONFIG } from "./const"
import { BoardType } from "../../../../../src/interface/board"

// 주어진 아이디에 해당하는 게시판 설정 가져오기
export async function getBoardConfig(id: string): Promise<AdminBoardConfig> {
  let result = INIT_BOARD_CONFIG
  result.id = id

  const [board] = await select(
    `SELECT uid, group_uid, admin_uid, type, name, info, row_count, width, use_category 
FROM ${table}board WHERE id = ? LIMIT 1`,
    [id],
  )
  if (!board) {
    return result
  }

  const groups = await select(`SELECT uid, id FROM ${table}group`)
  if (!groups[0]) {
    return result
  }

  const grps: AdminPair[] = []
  for (const grp of groups) {
    grps.push({ uid: grp.uid, name: grp.id })
  }

  const categories = await select(
    `SELECT uid, name FROM ${table}board_category 
WHERE board_uid = ? ORDER BY uid ASC`,
    [board.uid],
  )
  if (!categories[0]) {
    return result
  }

  const cats: AdminPair[] = []
  for (const cat of categories) {
    cats.push({ uid: cat.uid, name: cat.name })
  }

  result = {
    uid: board.uid,
    id,
    type: board.type as BoardType,
    groups: grps,
    groupUid: board.group_uid,
    name: board.name,
    info: board.info,
    rowCount: board.row_count,
    width: board.width,
    useCategory: board.use_category > 0 ? true : false,
    categories: cats,
  }

  return result
}
