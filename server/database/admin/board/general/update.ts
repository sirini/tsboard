/**
 * server/database/admin/board/general/update
 *
 * 게시판 관리 > 일반 > 업데이트에 필요한 함수들
 */

import { table, update, select, insert, remove } from "../../../common"

// 게시판 소속 그룹 변경하기
export async function changeGroup(boardUid: number, groupUid: number): Promise<void> {
  await update(`UPDATE ${table}board SET group_uid = ? WHERE uid = ? LIMIT 1`, [groupUid, boardUid])
}

// 게시판 이름 변경하기
export async function updateName(boardUid: number, newName: string): Promise<void> {
  await update(`UPDATE ${table}board SET name = ? WHERE uid = ? LIMIT 1`, [newName, boardUid])
}

// 게시판 설명 변경하기
export async function updateInfo(boardUid: number, newInfo: string): Promise<void> {
  await update(`UPDATE ${table}board SET info = ? WHERE uid = ? LIMIT 1`, [newInfo, boardUid])
}

// 게시판 형태 변경하기
export async function changeType(boardUid: number, newType: number): Promise<void> {
  await update(`UPDATE ${table}board SET type = ? WHERE uid = ? LIMIT 1`, [newType, boardUid])
}

// 한 페이지에 보여줄 게시글 갯수 변경하기
export async function updateRows(boardUid: number, newRows: number): Promise<void> {
  await update(`UPDATE ${table}board SET row = ? WHERE uid = ? LIMIT 1`, [newRows, boardUid])
}

// 게시판 너비 변경하기
export async function updateWidth(boardUid: number, newWidth: number): Promise<void> {
  await update(`UPDATE ${table}board SET width = ? WHERE uid = ? LIMIT 1`, [newWidth, boardUid])
}

// 카테고리 추가 전 중복 검사
async function isAlreadyAdded(boardUid: number, newCategory: string): Promise<boolean> {
  const [row] = await select(
    `SELECT uid FROM ${table}board_category WHERE board_uid = ? AND name = ? LIMIT 1`,
    [boardUid, newCategory],
  )
  if (row) {
    return true
  }
  return false
}

// 신규 카테고리 추가하기
export async function addCategory(boardUid: number, newCategory: string): Promise<number> {
  if ((await isAlreadyAdded(boardUid, newCategory)) === true) {
    return 0
  }
  const catUid = await insert(
    `INSERT INTO ${table}board_category (board_uid, name) VALUES (?, ?)`,
    [boardUid, newCategory],
  )
  return catUid
}

// 카테고리 삭제 전 게시판 고유 번호 확인하기
async function checkBoardUid(boardUid: number, categoryUid: number): Promise<boolean> {
  const [cat] = await select(`SELECT board_uid FROM ${table}board_category WHERE uid = ? LIMIT 1`, [
    categoryUid,
  ])
  if (!cat) {
    return false
  }
  if ((cat.board_uid as number) !== boardUid) {
    return false
  }
  return true
}

// 카테고리 삭제 전 카테고리 개수가 2개 이하인지 확인
async function checkCategoryCount(boardUid: number): Promise<boolean> {
  const [row] = await select(
    `SELECT COUNT(*) AS total_count FROM ${table}board_category WHERE board_uid = ?`,
    [boardUid],
  )
  if (!row) {
    return false
  }
  if (row.total_count < 2) {
    return false
  }
  return true
}

// 카테고리 삭제 후 삭제된 카테고리 소속 게시글들은 uid가 가장 낮은 카테고리 소속으로 변경
async function updatestatusCategory(boardUid: number, categoryUid: number): Promise<void> {
  const [cat] = await select(
    `SELECT uid FROM ${table}board_category WHERE board_uid = ? ORDER BY uid ASC LIMIT 1`,
    [boardUid],
  )
  if (!cat) {
    return
  }
  update(`UPDATE ${table}post SET category_uid = ? WHERE board_uid = ? AND category_uid = ?`, [
    cat.uid,
    boardUid,
    categoryUid,
  ])
}

// 카테고리 삭제하기
export async function removeCategory(boardUid: number, categoryUid: number): Promise<boolean> {
  if ((await checkBoardUid(boardUid, categoryUid)) === false) {
    return false
  }
  if ((await checkCategoryCount(boardUid)) === false) {
    return false
  }

  remove(`DELETE FROM ${table}board_category WHERE uid = ? LIMIT 1`, [categoryUid])
  updatestatusCategory(boardUid, categoryUid)

  return true
}
