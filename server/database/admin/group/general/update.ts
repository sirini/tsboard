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
  const userUidQuery = userUid.toString()
  const [user] = await select(`SELECT blocked FROM ${table}user WHERE uid = ? LIMIT 1`, [
    userUidQuery,
  ])
  if (!user) {
    return false
  }
  if ((user.blocked as number) !== 0) {
    return false
  }
  await update(`UPDATE ${table}group SET admin_uid = ? WHERE uid = ? LIMIT 1`, [
    userUidQuery,
    groupUid.toString(),
  ])
  return true
}

// 주어진 게시글 번호에 속한 파일들 삭제하기
async function removeFiles(postUid: number): Promise<void> {
  const files = await select(`SELECT path FROM ${table}file WHERE post_uid = ?`, [
    postUid.toString(),
  ])
  for (const file of files) {
    removeFile(`.${file.path}`)
  }
}

// 특정 게시판 삭제 시 가능한 DELETE 동작 보단 UPDATE로 처리
export async function removeBoard(boardUid: number): Promise<boolean> {
  const boardUidQuery = boardUid.toString()
  const [board] = await select(`SELECT id FROM ${table}board WHERE uid = ? LIMIT 1`, [
    boardUidQuery,
  ])
  if (!board) {
    return false
  }
  const posts = await select(`SELECT uid FROM ${table}post WHERE board_uid = ?`, [boardUidQuery])
  for (const post of posts) {
    await removeFiles(post.uid)
  }
  await update(`UPDATE ${table}file SET path = '' WHERE board_uid = ?`, [boardUidQuery])
  await update(`UPDATE ${table}comment SET status = ? WHERE board_uid = ?`, ["-1", boardUidQuery])
  await update(`UPDATE ${table}board_category SET name = '' WHERE board_uid = ?`, [boardUidQuery])
  await update(`UPDATE ${table}post SET status = ? WHERE board_uid = ?`, ["-1", boardUidQuery])
  await remove(`DELETE FROM ${table}board WHERE uid = ? LIMIT 1`, [boardUidQuery])
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
      groupUid.toString(),
      NEW_BOARD.ADMIN.toString(),
      NEW_BOARD.TYPE.toString(),
      NEW_BOARD.NAME,
      NEW_BOARD.INFO,
      NEW_BOARD.ROWS!.toString(),
      NEW_BOARD.WIDTH.toString(),
      NEW_BOARD.USE_CATEGORY.toString(),
      NEW_BOARD.LEVEL.LIST.toString(),
      NEW_BOARD.LEVEL.VIEW.toString(),
      NEW_BOARD.LEVEL.WRITE.toString(),
      NEW_BOARD.LEVEL.COMMENT.toString(),
      NEW_BOARD.LEVEL.DOWNLOAD.toString(),
      NEW_BOARD.POINT.VIEW.toString(),
      NEW_BOARD.POINT.WRITE.toString(),
      NEW_BOARD.POINT.COMMENT.toString(),
      NEW_BOARD.POINT.DOWNLOAD.toString(),
    ],
  )

  const boardUidQuery = boardUid.toString()
  if (NEW_BOARD.USE_CATEGORY > 0) {
    await insert(`INSERT INTO ${table}board_category (board_uid, name) VALUES (?, ?)`, [
      boardUidQuery,
      "lounge",
    ])
    await insert(`INSERT INTO ${table}board_category (board_uid, name) VALUES (?, ?)`, [
      boardUidQuery,
      "news",
    ])
    await insert(`INSERT INTO ${table}board_category (board_uid, name) VALUES (?, ?)`, [
      boardUidQuery,
      "qna",
    ])
    await insert(`INSERT INTO ${table}board_category (board_uid, name) VALUES (?, ?)`, [
      boardUidQuery,
      "discussion",
    ])
  }

  return boardUid
}
