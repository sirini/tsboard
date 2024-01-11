/**
 * server/database/admin/board/general/update
 *
 * 게시판 관리 > 일반 > 업데이트에 필요한 함수들
 */

import { table, update } from "../../../common"

// 게시판 소속 그룹 변경하기
export async function changeGroup(groupUid: number, boardUid: number): Promise<void> {
  await update(`UPDATE ${table}board SET group_uid = ? WHERE uid = ? LIMIT 1`, [groupUid, boardUid])
}
