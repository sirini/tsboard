/**
 * interface/user.ts
 *
 * 쪽지, 신고, 정보 보기, 관리 하기 (관리자용) 관련 인터페이스
 */

export interface TargetUserInfo {
  uid: number
  profile: string
  name: string
}

export interface BlockFeature {
  writePost: boolean
  writeComment: boolean
  note: boolean
  report: boolean
  login: boolean
}

export interface ChatHistory {
  userUid: number
  message: string
}
