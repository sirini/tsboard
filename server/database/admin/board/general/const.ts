/**
 * server/database/admin/board/general/const
 *
 * 게시판 설정 관리에 필요한 상수 기본값들 정의
 */

import { AdminBoardConfig } from "../../../../../src/interface/admin"
import { BoardType } from "../../../../../src/interface/board"
import { BOARD_TYPE } from "../../../board/const"

export const INIT_BOARD_CONFIG: AdminBoardConfig = {
  uid: 0,
  id: "",
  type: BOARD_TYPE.BOARD as BoardType,
  groups: [],
  groupUid: 0,
  name: "",
  info: "",
  rowCount: 0,
  width: 0,
  useCategory: false,
  categories: [],
}
