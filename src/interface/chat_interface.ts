import { UserBasicInfo } from "./user_interface"

// 쪽지 목록용 정보 타입 정의
export type ChatItem = {
  sender: UserBasicInfo
  uid: number
  message: string
  timestamp: number
}

// 쪽지 내용 보기용 정보 타입 정의
export type ChatHistory = {
  uid: number
  userUid: number
  message: string
  timestamp: number
}
