/**
 * server/database/home/visit
 *
 * 사용자 방문 통계용으로 업데이트
 */

import { table, select, insert } from "../common"

// 오늘 사용자가 방문을 했었는지 확인
export async function isVisitedToday(userUid: number): Promise<boolean> {
  const date = new Date()
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDay()).getTime()
  const [visit] = await select(
    `SELECT uid FROM ${table}user_access_log WHERE timestamp > ? AND user_uid = ?`,
    [today, userUid],
  )
  if (!visit) {
    return false
  }
  return true
}

// 오늘 방문한 걸로 등록하기
export async function addAccessLog(userUid: number): Promise<void> {
  insert(`INSERT INTO ${table}user_access_log (user_uid, timestamp) VALUES (?, ?)`, [
    userUid,
    Date.now(),
  ])
}
