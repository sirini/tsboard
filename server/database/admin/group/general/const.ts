/**
 * server/database/admin/group/general/const
 *
 * 관리화면 그룹 관리에 필요한 상수 기본값들 정의
 */

import { AdminBoardPermission, AdminGroupConfig } from "../../../../../src/interface/admin"
import { BoardType } from "../../../../../src/interface/board"
import { BOARD_TYPE } from "../../../board/const"

export const CREATE_BOARD_RESULT = {
  newAccessToken: "",
  uid: 0,
  type: BOARD_TYPE.BOARD as BoardType,
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
    profile: "",
  },
  level: {
    list: 0,
    view: 0,
    write: 0,
    comment: 0,
    download: 0,
  },
}
