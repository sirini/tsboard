/**
 * store/admin/group/const
 *
 * 그룹 관리화면용 스토어에 필요한 상수 기본값들 정의
 */

import { AdminGroupConfig } from "../../../interface/admin"

export const GROUP_CONFIG: AdminGroupConfig = {
  uid: 0,
  id: "",
  count: 0,
  manager: {
    uid: 0,
    name: "",
    profile: "",
  },
}
