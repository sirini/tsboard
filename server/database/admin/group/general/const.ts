/**
 * server/database/admin/group/general/const
 *
 * 관리화면 그룹 관리에 필요한 상수 기본값들 정의
 */

import { AdminGroupConfig } from "../../../../../src/interface/admin"
import { BoardConfig } from "../../../../../src/interface/board"

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

export const INIT_CONFIG: BoardConfig = {
  uid: 0,
  admin: { group: 0, board: 0 },
  type: 0,
  name: "",
  info: "",
  row: 0,
  width: 0,
  useCategory: false,
  category: [],
  level: { list: 0, view: 0, comment: 0, write: 0, download: 0 },
  point: { view: 0, comment: 0, write: 0, download: 0 },
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
