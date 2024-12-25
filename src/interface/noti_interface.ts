import { Board } from "./board_interface"
import { HomeNotice } from "./home_interface"
import { UserBasicInfo } from "./user_interface"

// 알림 타입 기본값
export const NOTICE = {
  LIKE_POST: 0,
  LIKE_COMMENT: 1,
  LEAVE_COMMENT: 2,
  REPLY_COMMENT: 3,
  CHAT_MESSAGE: 4,
}

// 알림내용 조회 항목 정의
export type NotificationItem = {
  uid: number
  fromUser: UserBasicInfo
  type: HomeNotice
  id: string
  boardType: Board
  postUid: number
  checked: boolean
  timestamp: number
}
