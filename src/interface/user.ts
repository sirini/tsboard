/**
 * interface/user.ts
 *
 * 쪽지, 신고, 정보 보기, 관리 하기 (관리자용) 관련 인터페이스
 */

export type TargetUserInfo = {
  uid: number
  profile: string
  name: string
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
  userUid: number
  message: string
}
