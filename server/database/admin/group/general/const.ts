/**
 * server/database/admin/group/general/const
 *
 * 관리화면 그룹 관리에 필요한 상수 기본값들 정의
 */

import {
  AdminBoardPermission,
  AdminGroupConfig,
  AdminPoint,
} from "../../../../../src/interface/admin"

export const CREATE_BOARD_RESULT = {
  newAccessToken: "",
  uid: 0,
  name: "",
  info: "",
  manager: {
    uid: 0,
    name: "",
  },
}

export const INIT_GROUP_CONFIG: AdminGroupConfig = {
  uid: 0,
  id: "",
  count: 0,
  manager: {
    uid: 0,
    name: "",
    profile: "",
  },
}

export const BOARD_PERMISSION: AdminBoardPermission = {
  uid: 0,
  id: "",
  admin: {
    uid: 0,
    name: "",
    profile: "/no-profile.svg",
  },
  level: {
    list: 0,
    view: 0,
    write: 0,
    comment: 0,
    download: 0,
  },
}

export const BOARD_POINT: AdminPoint = {
  uid: 0,
  view: { isPayment: true, amount: 0 },
  write: { isPayment: false, amount: 0 },
  comment: { isPayment: false, amount: 0 },
  download: { isPayment: true, amount: 0 },
}
