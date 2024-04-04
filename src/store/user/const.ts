/**
 * store/user/const
 *
 * 로그인, 인증 사용자 관리 등에 필요한 상수 기본값들 정의
 * 주의) 백엔드에서 동일하거나 비슷한 이름으로 정의된 객체는 클라이언트에서 사용금지
 */

import { User } from "../../interface/auth"
import { UserPermissionParams } from "../../interface/user"

export const INIT_USER: User = {
  uid: 0,
  id: "",
  name: "",
  profile: "/no-profile.svg",
  level: 0,
  point: 0,
  signature: "",
  signup: 0,
  signin: 0,
  admin: false,
  token: "",
}

export const INIT_PERMISSION: UserPermissionParams = {
  writePost: false,
  writeComment: false,
  sendChatMessage: false,
  sendReport: false,
  login: false,
  userUid: 0,
  response: "",
}

export const USER_INFO_KEY = "tsboardUserInfo"
