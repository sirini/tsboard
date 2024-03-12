/**
 * interface/user.ts
 *
 * 채팅, 신고, 정보 보기, 관리 하기 (관리자용) 관련 인터페이스
 */

import { Pair } from "./board"

export type UserBasicInfo = Pair & {
  profile: string
}

export type UserPermission = {
  writePost: boolean
  writeComment: boolean
  sendNote: boolean
  sendReport: boolean
  login: boolean
}

export type UserPermissionParams = UserPermission & {
  userUid: number
  response: string
}

export type ChatHistory = {
  uid: number
  userUid: number
  message: string
  timestamp: number
}

export type UserOpenInfo = UserBasicInfo & {
  level: number
  signature: string
  signup: number
  signin: number
  admin: boolean
  blocked: boolean
}
