// localStorage 키 값 정의
export const USER_INFO_KEY = "tsboardUserInfo"

// (로그인 한) 내 정보 타입 정의
export type MyInfoResult = UserInfoResult & {
  id: string
  point: number
  token: string
  refresh: string
}

// (공개된) 사용자 정보 기본값
export const USER_INFO_RESULT: UserInfoResult = {
  uid: 0,
  name: "",
  profile: "",
  level: 0,
  signature: "",
  signup: Date.now(),
  signin: Date.now(),
  admin: false,
  blocked: false,
}

// (로그인 한) 내 정보 타입 기본값
export const MY_INFO_RESULT: MyInfoResult = {
  ...USER_INFO_RESULT,
  id: "",
  point: 0,
  token: "",
  refresh: "",
}

// 사용자의 최소 기본 정보들 타입 정의
export type UserBasicInfo = {
  uid: number
  name: string
  profile: string
}

// 사용자의 최소 기본 정보 기본값 정의
export const USER_BASIC_INFO = {
  uid: 0,
  name: "",
  profile: "",
}

// (공개된) 사용자 정보 타입 정의
export type UserInfoResult = {
  uid: number
  name: string
  profile: string
  level: number
  signature: string
  signup: number
  signin: number
  admin: boolean
  blocked: boolean
}

// 사용자의 권한 정보들 타입 정의
export type UserPermissionResult = {
  writePost: boolean
  writeComment: boolean
  sendChatMessage: boolean
  sendReport: boolean
}

// 사용자 권한 및 로그인, 신고 내역 정의
export type UserPermissionReportResult = UserPermissionResult & {
  login: boolean
  userUid: number
  response: string
}

// 사용자 권한 및 로그인, 신고 내역 기본값
export const USER_PERMISSION_REPORT_RESULT: UserPermissionReportResult = {
  writePost: false,
  writeComment: false,
  sendChatMessage: false,
  sendReport: false,
  login: false,
  userUid: 0,
  response: "",
}
