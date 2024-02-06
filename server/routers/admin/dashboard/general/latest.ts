/**
 * server/routers/admin/home/general/latest
 *
 * 관리화면 첫페이지의 최근 게시글, 댓글, 신고 내용 가져오기
 */

import { Elysia, t } from "elysia"
import {
  getLatestPosts,
  getLatestComments,
  getLatestReports,
} from "../../../../database/admin/dashboard/general/latest"
import { success } from "../../../../util/tools"

export const latest = new Elysia().get(
  "/load/latest",
  async ({ query: { limit } }) => {
    const posts = await getLatestPosts(limit)
    const comments = await getLatestComments(limit)
    const reports = await getLatestReports(limit)

    return success({
      posts,
      comments,
      reports,
    })
  },
  {
    query: t.Object({
      limit: t.Numeric(),
    }),
  },
)
