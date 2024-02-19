/**
 * server/database/user/const
 *
 * 사용자 관리에 필요한 상수 기본값들 정의
 */

import { UserPermissionParams } from "../../../src/interface/user"

export const USER_PERMISSION_PARAMS: UserPermissionParams = {
  writePost: true,
  writeComment: true,
  sendNote: true,
  sendReport: true,
  login: true,
  userUid: 0,
  response: "",
}
