/**
 * server/database/user/chat
 *
 * 채팅 관련 필요한 함수들
 */

import { table, select, insert } from "../common"
import { ChatHistory, ChatItem } from "../../../src/interface/user"
import { NOTICE_TYPE } from "../board/const"
import { addNotification } from "../home/notification"
import { NoticeType } from "../../../src/interface/home"

// 채팅 목록들 가져오기
export async function getChatList(accessUserUid: number, limit: number): Promise<ChatItem[]> {
  let result: ChatItem[] = []

  const chats = await select(
    `SELECT MAX(uid) AS latest_uid, from_uid, MAX(message) AS latest_message, MAX(timestamp) AS latest_timestamp FROM ${table}chat 
  WHERE to_uid = ? GROUP BY from_uid ORDER BY latest_uid DESC LIMIT ?`,
    [accessUserUid.toString(), limit.toString()],
  )

  for (const chat of chats) {
    const [sender] = await select(`SELECT name, profile FROM ${table}user WHERE uid = ? LIMIT 1`, [
      chat.from_uid,
    ])
    result.push({
      sender: {
        uid: chat.from_uid,
        name: sender.name,
        profile: sender.profile,
      },
      message: chat.message,
      timestamp: chat.timestamp,
    })
  }
  return result
}

// 상대방과의 이전 채팅 내역 가져오기, 클라이언트에서 순서를 다시 뒤집어야 함
export async function getChatHistory(
  myUserUid: number,
  otherUserUid: number,
  limit: number,
): Promise<ChatHistory[]> {
  let result: ChatHistory[] = []

  const chats = await select(
    `SELECT uid, to_uid, from_uid, message, timestamp FROM ${table}chat 
  WHERE to_uid IN (?, ?) AND from_uid IN (?, ?)
  ORDER BY uid DESC LIMIT ?`,
    [
      myUserUid.toString(),
      otherUserUid.toString(),
      myUserUid.toString(),
      otherUserUid.toString(),
      limit.toString(),
    ],
  )

  for (const chat of chats) {
    result.push({
      uid: chat.uid,
      userUid: chat.from_uid,
      message: chat.message,
      timestamp: chat.timestamp,
    })
  }

  return result
}

// 채팅 내용 추가하기
export async function saveNewChat(
  myUserUid: number,
  otherUserUid: number,
  message: string,
): Promise<number> {
  const insertId = await insert(
    `INSERT INTO ${table}chat (to_uid, from_uid, message, timestamp) VALUES (?, ?, ?, ?)`,
    [otherUserUid.toString(), myUserUid.toString(), message, Date.now().toString()],
  )

  addNotification({
    toUid: otherUserUid,
    fromUid: myUserUid,
    type: NOTICE_TYPE.CHAT_MESSAGE as NoticeType,
    postUid: 0,
    commentUid: 0,
  })

  return insertId
}

// 상대방의 블랙리스트에 내가 등록되었는지 확인하기
export async function isBannedByOther(myUserUid: number, otherUserUid: number): Promise<boolean> {
  const [banned] = await select(
    `SELECT user_uid FROM ${table}user_black_list WHERE user_uid = ? AND black_uid = ? LIMIT 1`,
    [otherUserUid.toString(), myUserUid.toString()],
  )
  if (!banned) {
    return false
  }
  return true
}
