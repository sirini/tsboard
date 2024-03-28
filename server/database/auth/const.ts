/**
 * server/database/auth/const
 *
 * 사용자 인증 작업에 필요한 상수 기본값들 정의
 */

import { User } from "../../../src/interface/auth"

export const INIT_USER: User = {
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
  token: "",
}

export const SUPER_ADMIN_UID = 1
