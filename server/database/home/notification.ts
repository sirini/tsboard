/**
 * server/database/home/notification
 *
 * 알림 관련 필요한 함수들
 */

import { Notification } from "../../../src/interface/home"
import { AddNoticeParams } from "../board/const"
import { table, select, insert, update } from "../common"

// 알림 정보 추가하기
export async function addNotification(param: AddNoticeParams): Promise<void> {
  if (param.toUid === param.fromUid) {
    return
  }

  const [exist] = await select(
    `SELECT uid FROM ${table}notification WHERE 
    to_uid = ? AND from_uid = ? AND type = ? AND post_uid = ? AND comment_uid = ? LIMIT 1`,
    [param.toUid, param.fromUid, param.type, param.postUid, param.commentUid],
  )
  if (exist) {
    return
  }

  insert(
    `INSERT INTO ${table}notification (to_uid, from_uid, type, post_uid, comment_uid, checked, timestamp) 
  VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [param.toUid, param.fromUid, param.type, param.postUid, param.commentUid, 0, Date.now()],
  )
}

// 나에게 온 (아직 확인 안한) 알림들 가져오기
export async function getNotifications(userUid: number, limit: number): Promise<Notification[]> {
  let result: Notification[] = []
  const notifications = await select(
    `SELECT uid, from_uid, type, post_uid, timestamp FROM ${table}notification 
    WHERE to_uid = ? AND checked = 0 ORDER BY uid DESC LIMIT ?`,
    [userUid, limit],
  )
  if (!notifications[0]) {
    return result
  }

  for (const noti of notifications) {
    const [post] = await select(`SELECT board_uid FROM ${table}post WHERE uid = ? LIMIT 1`, [
      noti.post_uid,
    ])
    if (!post) {
      continue
    }
    const [board] = await select(`SELECT id FROM ${table}board WHERE uid = ? LIMIT 1`, [
      post.board_uid,
    ])
    if (!board) {
      continue
    }

    const [user] = await select(`SELECT name, profile FROM ${table}user WHERE uid = ? LIMIT 1`, [
      noti.from_uid,
    ])
    if (!user) {
      continue
    }

    result.push({
      uid: noti.uid,
      fromUser: {
        uid: noti.from_uid,
        name: user.name,
        profile: user.profile,
      },
      type: noti.type,
      id: board.id,
      postUid: noti.post_uid,
      timestamp: noti.timestamp,
    })

    update(`UPDATE ${table}notification SET checked = 1 WHERE uid = ? LIMIT 1`, [noti.uid])
  }

  return result
}
