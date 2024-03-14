/**
 * server/database/board/common
 *
 * 게시판 관련 함수들 중 공용으로 사용하는 함수들 모음
 */

import {
  CheckPermissionParams,
  CheckUserPermissionParams,
  POINT_HISTORY_TYPE,
  PermissionAction,
  SUPER_ADMIN,
  UpdatePointHistoryParams,
  UpdateUserPointParams,
} from "../../../src/interface/board"
import { insert, select, table, update } from "../common"
import { haveAdminPermission } from "../user/manageuser"
import { isAuthor } from "./editor"

// 사용자의 권한 확인하기 (권한 소유: 작성자, 게시판 관리자, 그룹 관리자, 최고 관리자)
export async function checkUserPermission(param: CheckUserPermissionParams): Promise<boolean> {
  if (param.accessUserUid === SUPER_ADMIN) {
    return true
  }

  const [target] = await select(
    `SELECT user_uid FROM ${table}${param.targetTable} 
  WHERE uid = ? LIMIT 1`,
    [param.targetUid],
  )
  if (target && param.accessUserUid === target.user_uid) {
    return true
  }

  const [board] = await select(
    `SELECT group_uid, admin_uid FROM ${table}board WHERE uid = ? LIMIT 1`,
    [param.boardUid],
  )
  if (board && param.accessUserUid === board.admin_uid) {
    return true
  }

  const [group] = await select(`SELECT admin_uid FROM ${table}group WHERE uid = ? LIMIT 1`, [
    board.group_uid,
  ])
  if (group && param.accessUserUid === group.admin_uid) {
    return true
  }
  return false
}

// 포인트 이력 업데이트하기
async function updatePointHistory(param: UpdatePointHistoryParams): Promise<void> {
  let action = POINT_HISTORY_TYPE.VIEW
  if (param.action === "comment") {
    action = POINT_HISTORY_TYPE.WRITE_COMMENT
  } else if (param.action === "write") {
    action = POINT_HISTORY_TYPE.WRITE_POST
  } else if (param.action === "download") {
    action = POINT_HISTORY_TYPE.DOWNLOAD
  }

  insert(
    `INSERT INTO ${table}point_history (user_uid, board_uid, action, point) VALUES 
  (?, ?, ?, ?)`,
    [param.accessUserUid, param.boardUid, action, param.point],
  )
}

// 포인트 업데이트하기, 포인트 부족 시 false
export async function updateUserPoint(param: UpdateUserPointParams): Promise<boolean> {
  if (param.accessUserUid < 1) {
    return false
  }

  const [board] = await select(
    `SELECT point_${param.action} AS point FROM ${table}board WHERE uid = ? LIMIT 1`,
    [param.boardUid],
  )
  if (!board) {
    return false
  }

  const [user] = await select(`SELECT point FROM ${table}user WHERE uid = ? LIMIT 1`, [
    param.accessUserUid,
  ])
  if (!user) {
    return false
  }

  if (board.point < 0 && user.point < Math.abs(board.point)) {
    return false
  }

  const newPoint = user.point + board.point
  update(`UPDATE ${table}user SET point = ? WHERE uid = ? LIMIT 1`, [newPoint, param.accessUserUid])
  updatePointHistory({
    accessUserUid: param.accessUserUid,
    boardUid: param.boardUid,
    action: param.action,
    point: board.point,
  })

  return true
}

// 사용자가 권한이 있는지 확인하기
export async function havePermission(userUid: number, action: PermissionAction): Promise<boolean> {
  const [perm] = await select(
    `SELECT ${action} AS action FROM ${table}user_permission WHERE user_uid = ? LIMIT 1`,
    [userUid],
  )
  if (!perm) {
    return true
  }
  if (perm.action > 0) {
    return true
  }
  return false
}

// 관리자인지, 작성자인지, 권한은 있는지 확인 후 (이상 있을 시) 리턴 메시지 반환
export async function checkPermission(
  param: CheckPermissionParams,
): Promise<{ result: boolean; error: string }> {
  const isAdmin = await haveAdminPermission(param.accessUserUid)
  const isWriter = await isAuthor(param.postUid, param.accessUserUid, param.target)
  const hasPerm = await havePermission(param.accessUserUid, param.action)
  if (isAdmin === false && isWriter === false) {
    return { result: false, error: `You are neither the author nor the administrator.` }
  }
  if (isAdmin === false && hasPerm === false) {
    return { result: false, error: `You have no permission.` }
  }
  return { result: true, error: "" }
}
