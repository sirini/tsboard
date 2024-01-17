/**
 * server/database/admin/board/permission/update
 *
 * 게시판 관리 > 권한 > 업데이트에 필요한 함수들
 */

import { AdminPermissionLevel } from "../../../../../src/interface/admin"
import { table, update, select } from "../../../common"

// 게시판 관리자 변경하기
export async function changeBoardAdmin(boardUid: number, userUid: number): Promise<boolean> {
  const [user] = await select(`SELECT blocked FROM ${table}user WHERE uid = ? LIMIT 1`, [userUid])
  if (!user) {
    return false
  }
  if ((user.blocked as number) !== 0) {
    return false
  }
  await update(`UPDATE ${table}board SET admin_uid = ? WHERE uid = ? LIMIT 1`, [userUid, boardUid])
  return true
}

// 게시판 권한 레벨 변경하기
export async function updatePermissionLevels(
  boardUid: number,
  levels: AdminPermissionLevel,
): Promise<void> {
  await update(
    `UPDATE ${table}board SET level_list = ?, level_view = ?, level_write = ?, level_comment = ?, level_download = ? 
  WHERE uid = ? LIMIT 1`,
    [levels.list, levels.view, levels.write, levels.comment, levels.download, boardUid],
  )
}
