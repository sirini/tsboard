/**
 * server/database/user/manageuser
 *
 * 회원 관리에 필요한 함수들
 */

import { table, select, update, insert } from "../common"
import { UserPermission, UserPermissionParams } from "../../../src/interface/user"

// 주어진 회원 번호가 관리 권한이 있는지 반환 (그룹 관리자 이상만 true)
export async function hasPermission(userUid: number): Promise<boolean> {
  let admins = [1]
  const uids = await select(`SELECT admin_uid FROM ${table}group`)
  for (const uid of uids) {
    admins.push(uid.admin_uid)
  }
  return admins.includes(userUid)
}

// 회원 권한 조회하기
export async function getUserPermission(userUid: number): Promise<UserPermissionParams> {
  let result: UserPermissionParams = {
    writePost: true,
    writeComment: true,
    sendNote: true,
    sendReport: true,
    login: true,
    userUid,
    response: "",
  }
  const [perm] = await select(
    `SELECT write_post, write_comment, send_note, send_report FROM ${table}user_permission 
  WHERE user_uid = ? LIMIT 1`,
    [userUid],
  )
  if (!perm) {
    return result
  }
  const [user] = await select(`SELECT blocked FROM ${table}user WHERE uid = ? LIMIT 1`, [userUid])
  const [report] = await select(`SELECT response FROM ${table}report WHERE to_uid = ? LIMIT 1`, [
    userUid,
  ])
  result = {
    writePost: perm.write_post > 0 ? true : false,
    writeComment: perm.write_comment > 0 ? true : false,
    sendNote: perm.send_note > 0 ? true : false,
    sendReport: perm.send_report > 0 ? true : false,
    login: user.blocked < 1 ? true : false,
    userUid,
    response: report?.response ?? "",
  }
  return result
}

// 회원 조치사항 반영하기
export async function updateUserPermission(
  param: UserPermissionParams,
  accessUserUid: number,
): Promise<void> {
  const [perm] = await select(
    `SELECT uid FROM ${table}user_permission WHERE user_uid = ? LIMIT 1`,
    [param.userUid],
  )
  if (perm) {
    await update(
      `UPDATE ${table}user_permission SET write_post = ?, write_comment = ?, send_note = ?, send_report = ?
    WHERE user_uid = ? LIMIT 1`,
      [
        param.writePost ? 1 : 0,
        param.writeComment ? 1 : 0,
        param.sendNote ? 1 : 0,
        param.sendReport ? 1 : 0,
        param.userUid,
      ],
    )
  } else {
    await insert(
      `INSERT INTO ${table}user_permission (user_uid, write_post, write_comment, send_note, send_report) 
    VALUES (?, ?, ?, ?, ?)`,
      [
        param.userUid,
        param.writePost ? 1 : 0,
        param.writeComment ? 1 : 0,
        param.sendNote ? 1 : 0,
        param.sendReport ? 1 : 0,
      ],
    )
  }

  const [report] = await select(`SELECT uid FROM ${table}report WHERE to_uid = ? LIMIT 1`, [
    param.userUid,
  ])
  if (report) {
    await update(`UPDATE ${table}report SET response = ?, solved = ? WHERE to_uid = ?`, [
      param.response,
      1,
      param.userUid,
    ])
  } else {
    await insert(
      `INSERT INTO ${table}report (to_uid, from_uid, request, response, timestamp, solved) VALUES 
    (?, ?, ?, ?, ?, ?)`,
      [param.userUid, accessUserUid, "", param.response, Date.now(), 1],
    )
  }

  // 주의) login == true 로그인 가능이므로 blocked = 0
  await update(`UPDATE ${table}user SET blocked = ? WHERE uid = ? LIMIT 1`, [
    param.login ? 0 : 1,
    param.userUid,
  ])
  await insert(`INSERT INTO ${table}note (to_uid, from_uid, note, timestamp) VALUES (?, ?, ?, ?)`, [
    param.userUid,
    accessUserUid,
    param.response,
    Date.now(),
  ])
}
