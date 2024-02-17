/**
 * store/admin/user/const
 *
 * 회원 관리화면용 스토어에 필요한 상수 기본값들 정의
 */

import { UserModifyResult } from "../../../interface/auth"

export const USER_INFO: UserModifyResult = {
  uid: 0,
  id: "",
  name: "",
  profile: `/no-profile.svg`,
  level: 0,
  point: 0,
  signature: "",
}
