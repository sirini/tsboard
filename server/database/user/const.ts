/**
 * server/database/user/const
 *
 * 사용자 관리에 필요한 상수 기본값들 정의
 */

import { UserOpenInfo, UserPermissionParams } from "../../../src/interface/user"

export const USER_PERMISSION_PARAMS: UserPermissionParams = {
  writePost: true,
  writeComment: true,
  sendChatMessage: true,
  sendReport: true,
  login: true,
  userUid: 0,
  response: "",
}

export const USER_OPEN_INFO: UserOpenInfo = {
  uid: 0,
  name: "",
  profile: "",
  level: 0,
  signature: "",
  signup: 0,
  signin: 0,
  admin: false,
  blocked: false,
}
