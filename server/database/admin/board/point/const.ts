/**
 * server/database/admin/board/point/const
 *
 * 게시판 관리화면 / 포인트에 필요한 상수 기본값들 정의
 */

import { AdminPoint } from "../../../../../src/interface/admin"

export const INIT_POINT_CONFIG: AdminPoint = {
  uid: 0,
  view: { isPayment: false, amount: 0 },
  write: { isPayment: false, amount: 0 },
  comment: { isPayment: false, amount: 0 },
  download: { isPayment: false, amount: 0 },
}
