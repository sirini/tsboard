/**
 * server/database/admin/board/point/update
 *
 * 게시판 관리 > 포인트 > 업데이트에 필요한 함수들
 */

import { AdminBoardPointList } from "../../../../../src/interface/admin"
import { table, update } from "../../../common"

// 게시판 포인트 변경하기
export async function updatePoints(boardUid: number, points: AdminBoardPointList): Promise<void> {
  const view = points.view.isPayment ? points.view.amount * -1 : points.view.amount
  const write = points.write.isPayment ? points.write.amount * -1 : points.write.amount
  const comment = points.comment.isPayment ? points.comment.amount * -1 : points.comment.amount
  const download = points.download.isPayment ? points.download.amount * -1 : points.download.amount

  await update(
    `UPDATE ${table}board SET point_view = ?, point_write = ?, point_comment = ?, point_download = ? 
  WHERE uid = ? LIMIT 1`,
    [
      view.toString(),
      write.toString(),
      comment.toString(),
      download.toString(),
      boardUid.toString(),
    ],
  )
}
