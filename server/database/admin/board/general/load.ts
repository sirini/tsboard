/**
 * server/database/admin/board/general/load
 *
 * 게시판 관리 > 일반 > 불러오기에 필요한 함수들
 */

import { table, select } from "../../../common"
import { AdminBoardConfig, AdminPairItem, BoardType } from "../../../../../src/interface/admin"

// 게시판 형태 반영
function convertBoardType(type: number): BoardType {
  if (type === 1) return "gallery"
  if (type === 2) return "blog"
  return "board"
}

// 주어진 아이디에 해당하는 게시판 설정 가져오기
export async function getBoardConfig(id: string): Promise<AdminBoardConfig> {
  let result: AdminBoardConfig = {
    uid: 0,
    id,
    type: "board",
    groups: [],
    groupUid: 0,
    name: "",
    info: "",
    row: 0,
    width: 0,
    categories: [],
  }

  const [board] = await select(
    `SELECT uid, group_uid, admin_uid, type, name, info, row, width 
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

  const grps: AdminPairItem[] = []
  for (const grp of groups) {
    grps.push({ uid: grp.uid, name: grp.id })
  }

  const categories = await select(
    `SELECT uid, name FROM ${table}board_category 
WHERE board_uid = ?`,
    [board.uid],
  )
  if (!categories[0]) {
    return result
  }

  const cats: AdminPairItem[] = []
  for (const cat of categories) {
    cats.push({ uid: cat.uid, name: cat.name })
  }

  result = {
    uid: board.uid,
    id,
    type: convertBoardType(board.type as number),
    groups: grps,
    groupUid: board.group_uid,
    name: board.name,
    info: board.info,
    row: board.row,
    width: board.width,
    categories: cats,
  }

  return result
}
