/**
 * server/database/admin/board/permission/const
 *
 * 게시판 작업 / 권한(레벨) 조정에 필요한 상수 기본값들 정의
 */

import { AdminBoardPermission } from "../../../../../src/interface/admin"

export const INIT_PERMISSION_CONFIG: AdminBoardPermission = {
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
