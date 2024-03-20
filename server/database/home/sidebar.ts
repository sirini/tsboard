/**
 * server/database/home/sidebar
 *
 * 웹사이트 사이드바에 필요한 함수들
 */

import { BoardType } from "../../../src/interface/board"
import { BoardItem, GroupItem } from "../../../src/interface/home"
import { table, select } from "../common"

// 그룹 목록 및 하위 게시판들의 목록 가져오기
export async function getSidebarLinks(): Promise<GroupItem[]> {
  let result: GroupItem[] = []
  const groups = await select(`SELECT uid, id FROM ${table}group`)
  for (const group of groups) {
    const item: BoardItem[] = []
    const boards = await select(
      `SELECT id, type, name, info FROM ${table}board WHERE group_uid = ?`,
      [group.uid],
    )
    for (const board of boards) {
      item.push({
        id: board.id,
        type: board.type as BoardType,
        name: board.name,
        info: board.info,
      })
    }
    result.push({
      group: group.id,
      boards: item,
    })
  }
  return result
}
