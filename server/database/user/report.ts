/**
 * server/database/user/report
 *
 * 신고 관련 기능에 필요한 함수들
 */

import { table, select, insert } from "../common"

// 블랙리스트에 추가
export async function addBlackList(myUserUid: number, blackUserUid: number): Promise<void> {
  const [row] = await select(
    `SELECT user_uid FROM ${table}user_black_list WHERE user_uid = ? AND black_uid = ? LIMIT 1`,
    [myUserUid, blackUserUid],
  )
  if (row) {
    return /* already added */
  }
  insert(`INSERT INTO ${table}user_black_list (user_uid, black_uid) VALUES (?, ?)`, [
    myUserUid,
    blackUserUid,
  ])
}

// 신고하기
export async function sendReport(
  myUserUid: number,
  otherUserUid: number,
  content: string,
): Promise<void> {
  insert(
    `INSERT INTO ${table}report (to_uid, from_uid, request, response, timestamp, solved) VALUES (?, ?, ?, ?, ?, ?)`,
    [otherUserUid, myUserUid, content, "", Date.now(), 0],
  )
}
