/**
 * server/database/admin/board/general/const
 *
 * 게시판 설정 관리에 필요한 상수 기본값들 정의
 */

import { AdminBoardConfig } from "../../../../../src/interface/admin"

export const INIT_BOARD_CONFIG: AdminBoardConfig = {
  uid: 0,
  id: "",
  type: "board",
  groups: [],
  groupUid: 0,
  name: "",
  info: "",
  row: 0,
  width: 0,
  categories: [],
}
