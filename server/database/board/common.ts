/**
 * server/database/board/common
 *
 * 게시판 관련 함수들 중 공용으로 사용하는 함수들 모음
 */

import { CheckUserPermissionParams, SUPER_ADMIN } from "../../../src/interface/board"
import { insert, select, table, update } from "../common"
import { AddNoticeParams } from "./const"

// 알림 정보 추가하기
export async function addNotice(param: AddNoticeParams): Promise<void> {
  insert(
    `INSERT INTO ${table}notice (to_uid, from_uid, type, post_uid, comment_uid, checked, timestamp) 
  VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [param.toUid, param.fromUid, param.type, param.postUid, param.commentUid, 0, Date.now()],
  )
}

// 사용자의 권한 확인하기 (권한 소유: 댓글 작성자, 게시판 관리자, 그룹 관리자, 최고 관리자)
export async function checkUserPermission(param: CheckUserPermissionParams): Promise<boolean> {
  if (param.userUid === SUPER_ADMIN) {
    return true
  }

  const [target] = await select(
    `SELECT user_uid FROM ${table}${param.targetTable} 
  WHERE uid = ? LIMIT 1`,
    [param.targetUid],
  )
  if (target && param.userUid === target.user_uid) {
    return true
  }

  const [board] = await select(
    `SELECT group_uid, admin_uid FROM ${table}board WHERE uid = ? LIMIT 1`,
    [param.boardUid],
  )
  if (board && param.userUid === board.admin_uid) {
    return true
  }

  const [group] = await select(`SELECT admin_uid FROM ${table}group WHERE uid = ? LIMIT 1`, [
    board.group_uid,
  ])
  if (group && param.userUid === group.admin_uid) {
    return true
  }
  return false
}

// 포인트 업데이트하기
export async function updateUserPoint(action: "comment" | "write", userUid: number): Promise<void> {
  // TODO
}
