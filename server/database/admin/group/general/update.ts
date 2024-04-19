/**
 * server/database/admin/group/general/update
 *
 * 그룹 관리에 필요한 함수들
 */

import { table, update, select, remove, insert } from "../../../common"
import { removeFile } from "../../../../util/tools"
import { NEW_BOARD } from "../../../../../tsboard.config"

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

// 주어진 게시글 번호에 속한 파일들 삭제하기
async function removeFiles(postUid: number): Promise<void> {
  const files = await select(`SELECT path FROM ${table}file WHERE post_uid = ?`, [postUid])
  for (const file of files) {
    removeFile(`.${file.path}`)
  }
}

// 특정 게시판 삭제 시 가능한 DELETE 동작 보단 UPDATE로 처리
export async function removeBoard(boardUid: number): Promise<boolean> {
  const [board] = await select(`SELECT id FROM ${table}board WHERE uid = ? LIMIT 1`, [boardUid])
  if (!board) {
    return false
  }
  const posts = await select(`SELECT uid FROM ${table}post WHERE board_uid = ?`, [boardUid])
  for (const post of posts) {
    await removeFiles(post.uid)
  }
  await update(`UPDATE ${table}file SET path = '' WHERE board_uid = ?`, [boardUid])
  await update(`UPDATE ${table}comment SET status = ? WHERE board_uid = ?`, [-1, boardUid])
  await update(`UPDATE ${table}board_category SET name = '' WHERE board_uid = ?`, [boardUid])
  await update(`UPDATE ${table}post SET status = ? WHERE board_uid = ?`, [-1, boardUid])
  await remove(`DELETE FROM ${table}board WHERE uid = ? LIMIT 1`, [boardUid])
  return true
}

// 게시판 생성하기
export async function createBoard(newId: string, groupUid: number): Promise<number> {
  const [check] = await select(`SELECT uid FROM ${table}board WHERE id = ? LIMIT 1`, [newId])
  if (check) {
    return 0
  }
  const boardUid = await insert(
    `INSERT INTO ${table}board 
  (id, group_uid, admin_uid, type, name, info, row_count, width, use_category, 
    level_list, level_view, level_write, level_comment, level_download, 
    point_view, point_write, point_comment, point_download) VALUES 
  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newId,
      groupUid,
      NEW_BOARD.ADMIN,
      NEW_BOARD.TYPE,
      NEW_BOARD.NAME,
      NEW_BOARD.INFO,
      NEW_BOARD.ROWS!,
      NEW_BOARD.WIDTH,
      NEW_BOARD.USE_CATEGORY,
      NEW_BOARD.LEVEL.LIST,
      NEW_BOARD.LEVEL.VIEW,
      NEW_BOARD.LEVEL.WRITE,
      NEW_BOARD.LEVEL.COMMENT,
      NEW_BOARD.LEVEL.DOWNLOAD,
      NEW_BOARD.POINT.VIEW,
      NEW_BOARD.POINT.WRITE,
      NEW_BOARD.POINT.COMMENT,
      NEW_BOARD.POINT.DOWNLOAD,
    ],
  )

  if (NEW_BOARD.USE_CATEGORY > 0) {
    await insert(`INSERT INTO ${table}board_category (board_uid, name) VALUES (?, ?)`, [
      boardUid,
      "lounge",
    ])
    await insert(`INSERT INTO ${table}board_category (board_uid, name) VALUES (?, ?)`, [
      boardUid,
      "news",
    ])
    await insert(`INSERT INTO ${table}board_category (board_uid, name) VALUES (?, ?)`, [
      boardUid,
      "qna",
    ])
    await insert(`INSERT INTO ${table}board_category (board_uid, name) VALUES (?, ?)`, [
      boardUid,
      "discussion",
    ])
  }

  return boardUid
}
