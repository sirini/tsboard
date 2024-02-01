/**
 * server/database/admin/group/general/update
 *
 * 그룹 관리에 필요한 함수들
 */

import { table, update, select, remove, insert } from "../../../common"
import { removeFile } from "../../../../util/tools"

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

// 주어진 게시글 번호에 속한 댓글들 삭제하기
async function removeComments(postUid: number): Promise<void> {
  const comments = await select(`SELECT uid FROM ${table}comment WHERE post_uid = ?`, [postUid])
  for (const comment of comments) {
    await remove(`DELETE FROM ${table}comment_like WHERE comment_uid = ?`, [comment.uid])
  }
  await remove(`DELETE FROM ${table}comment WHERE post_uid = ?`, [postUid])
}

// 주어진 게시글 번호에 속한 파일들 삭제하기
async function removeFiles(postUid: number): Promise<void> {
  const files = await select(`SELECT path FROM ${table}file WHERE post_uid = ?`, [postUid])
  for (const file of files) {
    removeFile(`.${file.path}`)
  }
  await remove(`DELETE FROM ${table}file WHERE post_uid = ?`, [postUid])
}

// 특정 게시판 삭제하기
export async function removeBoard(boardUid: number): Promise<boolean> {
  const [board] = await select(`SELECT id FROM ${table}board WHERE uid = ? LIMIT 1`, [boardUid])
  if (!board) {
    return false
  }

  const posts = await select(`SELECT uid FROM ${table}post WHERE board_uid = ?`, [boardUid])

  for (const post of posts) {
    await removeComments(post.uid)
    await remove(`DELETE FROM ${table}post_hashtag WHERE post_uid = ?`, [post.uid])
    await remove(`DELETE FROM ${table}post_like WHERE post_uid = ?`, [post.uid])
    await removeFiles(post.uid)
  }

  await remove(`DELETE FROM ${table}board_category WHERE board_uid = ?`, [boardUid])
  await remove(`DELETE FROM ${table}post WHERE board_uid = ?`, [boardUid])
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
  (id, group_uid, admin_uid, type, name, info, row, width, use_category, 
    level_list, level_view, level_write, level_comment, level_download, 
    point_view, point_write, point_comment, point_download) VALUES 
  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newId,
      groupUid,
      process.env.BOARD_ADMIN!,
      process.env.BOARD_TYPE!,
      process.env.BOARD_NAME!,
      process.env.BOARD_INFO!,
      process.env.BOARD_ROW!,
      process.env.BOARD_WIDTH!,
      process.env.BOARD_USE_CATEGORY!,
      process.env.BOARD_LEVEL_LIST!,
      process.env.BOARD_LEVEL_VIEW!,
      process.env.BOARD_LEVEL_WRITE!,
      process.env.BOARD_LEVEL_COMMENT!,
      process.env.BOARD_LEVEL_DOWNLOAD!,
      process.env.BOARD_POINT_VIEW!,
      process.env.BOARD_POINT_WRITE!,
      process.env.BOARD_POINT_COMMENT!,
      process.env.BOARD_POINT_DOWNLOAD!,
    ],
  )

  if (process.env.BOARD_USE_CATEGORY! === "1") {
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
