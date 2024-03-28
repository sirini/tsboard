/**
 * server/database/admin/board/point/load
 *
 * 게시판 관리 > 포인트 > 불러오기에 필요한 함수들
 */

import { table, select } from "../../../common"
import { AdminPoint } from "../../../../../src/interface/admin"
import { INIT_POINT_CONFIG } from "./const"

// 포인트 정보 가져오기
export async function getPointConfig(id: string): Promise<AdminPoint> {
  let result: AdminPoint = INIT_POINT_CONFIG

  const [board] = await select(
    `SELECT uid, point_view, point_write, point_comment, point_download 
  FROM ${table}board WHERE id = ? LIMIT 1`,
    [id],
  )
  if (!board) {
    return result
  }

  result = {
    uid: board.uid,
    view: {
      isPayment: board.point_view < 0 ? true : false,
      amount: Math.abs(board.point_view),
    },
    write: {
      isPayment: board.point_write < 0 ? true : false,
      amount: Math.abs(board.point_write),
    },
    comment: {
      isPayment: board.point_comment < 0 ? true : false,
      amount: Math.abs(board.point_comment),
    },
    download: {
      isPayment: board.point_download < 0 ? true : false,
      amount: Math.abs(board.point_download),
    },
  }

  return result
}
