/**
 * server/database/board/list
 *
 * 게시판 목록보기에 필요한 함수들
 */

import { BoardConfig, Pair } from "../../../src/interface/board"
import { table, select } from "../common"

// 게시판 기본 설정 가져오기
export async function getBoardConfig(id: string): Promise<BoardConfig> {
  let result: BoardConfig = {
    uid: 0,
    admin: {
      group: 0,
      board: 0,
    },
    type: 0,
    name: "",
    info: "",
    row: 0,
    width: 0,
    useCategory: false,
    category: [{ uid: 0, name: "" }],
    level: {
      list: 0,
      view: 0,
      write: 0,
      comment: 0,
      download: 0,
    },
    point: {
      view: 0,
      write: 0,
      comment: 0,
      download: 0,
    },
  }

  const [board] = await select(`SELECT uid, group_uid, admin_uid, type, name, 
    info, row, width, use_category, 
  level_list, level_view, level_write, level_comment, level_download, 
  point_view, point_write, point_comment, point_download
  FROM ${table}board WHERE id = '${id}' LIMIT 1`)
  if (!board) {
    return result
  }

  const categories = await select(
    `SELECT uid, name FROM ${table}board_category WHERE board_uid = ?`,
    [board.uid],
  )
  let category: Pair[] = []
  for (const cat of categories) {
    category.push({ uid: cat.uid, name: cat.name })
  }

  const [group] = await select(`SELECT admin_uid FROM ${table}group WHERE uid = ? LIMIT 1`, [
    board.group_uid,
  ])

  result = {
    uid: board.uid,
    admin: {
      group: group.admin_uid,
      board: board.admin_uid,
    },
    type: board.type,
    name: board.name,
    info: board.info,
    row: board.row,
    width: board.width,
    useCategory: board.use_category,
    category,
    level: {
      list: board.level_list,
      view: board.level_view,
      write: board.level_write,
      comment: board.level_comment,
      download: board.level_download,
    },
    point: {
      view: board.point_view,
      write: board.point_write,
      comment: board.point_comment,
      download: board.point_download,
    },
  }

  return result
}
