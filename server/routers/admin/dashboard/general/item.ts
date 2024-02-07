/**
 * server/routers/admin/home/general/list
 *
 * 관리화면 첫페이지의 그룹, 게시판, 회원 목록 최신순으로 가져오기
 */

import { Elysia, t } from "elysia"
import {
  getGroupList,
  getBoardList,
  getMemberList,
} from "../../../../database/admin/dashboard/general/list"
import { success } from "../../../../util/tools"

export const item = new Elysia().get(
  "/load/item",
  async ({ query: { limit } }) => {
    const groups = await getGroupList(limit)
    const boards = await getBoardList(limit)
    const members = await getMemberList(limit)

    return success({
      groups,
      boards,
      members,
    })
  },
  {
    query: t.Object({
      limit: t.Numeric(),
    }),
  },
)
