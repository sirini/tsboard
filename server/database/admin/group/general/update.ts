/**
 * server/database/admin/group/general/update
 *
 * 그룹 관리에 필요한 함수들
 */

import { table, update, select, remove } from "../../../common"

// 그룹 관리자 변경하기
export async function changeGroupAdmin(groupUid: number, userUid: number): Promise<boolean> {
  const [user] = await select(`SELECT blocked FROM ${table}user WHERE uid = ? LIMIT 1`, [userUid])
  if (!user) {
    return false
  }
  if ((user.blocked as number) !== 0) {
    return false
  }
  await update(`UPDATE ${table}group SET admin_uid = ? WHERE uid = ? LIMIT 1`, [userUid, groupUid])
  return true
}

// 특정 게시판 삭제하기
export async function removeBoard(boardUid: number): Promise<boolean> {
  const [board] = await select(`SELECT id FROM ${table}board WHERE uid = ? LIMIT 1`, [boardUid])
  if (!board) {
    return false
  }

  const [posts] = await select(`SELECT uid FROM ${table}post WHERE board_uid = ?`, [boardUid])
  if (!posts[0]) {
    return true /* empty table */
  }

  await remove(`DELETE FROM ${table}board_category WHERE board_uid = ?`, [boardUid])

  // TODO 삭제 처리 

  return true
}
