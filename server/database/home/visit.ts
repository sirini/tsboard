/**
 * server/database/home/visit
 *
 * 사용자 방문 통계용으로 업데이트
 */

import { table, select, insert } from "../common"

// 오늘 방문한 걸로 등록하기
export async function addAccessLog(userUid: number): Promise<void> {
  insert(`INSERT INTO ${table}user_access_log (user_uid, timestamp) VALUES (?, ?)`, [
    userUid,
    Date.now(),
  ])
}
