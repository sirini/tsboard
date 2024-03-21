/**
 * server/database/admin/board/general/const
 *
 * 게시판 설정 관리에 필요한 상수 기본값들 정의
 */

import { AdminBoardConfig } from "../../../../../src/interface/admin"
import { BOARD_TYPE, BoardType } from "../../../../../src/interface/board"

export const INIT_BOARD_CONFIG: AdminBoardConfig = {
  uid: 0,
  id: "",
  type: BOARD_TYPE.BOARD as BoardType,
  groups: [],
  groupUid: 0,
  name: "",
  info: "",
  row: 0,
  width: 0,
  useCategory: false,
  categories: [],
}
