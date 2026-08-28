export type UserBasicInfo = {
  uid: number
  name: string
  profile: string
}

export type UserInfo = UserBasicInfo & {
  level: number
  signature: string
  signup: number
  signin: number
  admin: boolean
  blocked: boolean
}

export type CurrentUser = UserInfo & {
  id: string
  point: number
  token: string
  refresh: string
}

export const EMPTY_USER: CurrentUser = {
  uid: 0,
  id: "",
  name: "",
  profile: "",
  level: 0,
  point: 0,
  signature: "",
  signup: 0,
  signin: 0,
  admin: false,
  blocked: false,
  token: "",
  refresh: "",
}

export type UserPermission = {
  writePost: boolean
  writeComment: boolean
  sendChatMessage: boolean
  sendReport: boolean
}

export type UserPermissionManage = UserPermission & {
  login: boolean
  userUid: number
  response: string
}

export type UserReportStatus = {
  isReported: boolean
  isBannedByMe: boolean
}

export type SignupMode = "verified_email" | "invite_only" | "disabled"

export type SignupStatus = {
  mode: SignupMode
  mailConfigured: boolean
  oauthRegistrationAllowed: boolean
}

export type SignupResult = {
  target: number
  requiresVerification: boolean
  completed: boolean
}

export type SignupInvite = {
  uid: number
  email: string
  created: number
  expires: number
  used: number
  revoked: boolean
  createdBy: number
}

export type SignupInviteCreated = SignupInvite & { token: string; url: string }
