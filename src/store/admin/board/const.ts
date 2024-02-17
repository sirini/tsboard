/**
 * store/admin/board/const
 *
 * 게시판 관리에 필요한 스토어에서 사용될 상수 기본값들 정의
 */

import { AdminBoardConfig, AdminBoardPermission, AdminPoint } from "../../../interface/admin"
import { GENERAL } from "../../../messages/store/admin/board/general"

export const BOARD_CONFIG: AdminBoardConfig = {
  uid: 0,
  id: "",
  type: "board",
  groups: [],
  groupUid: 0,
  name: "",
  info: GENERAL.UNKNOWN_INFO,
  row: 20,
  width: 1000,
  categories: [{ uid: 1, name: "기본" }],
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
