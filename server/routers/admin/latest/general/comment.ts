/**
 * server/routers/admin/latest/general/comment
 *
 * 최신 댓글 톺아보기에 필요한 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import {
  getComments,
  getSearchedComments,
  getMaxCommentUid,
} from "../../../../database/admin/latest/general/comment"
import { fail, success, DEFAULT_TYPE_CHECK } from "../../../../util/tools"

export const comment = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/comment",
    async ({ query: { page, bunch } }) => {
      const response = {
        comments: [],
        maxCommentUid: 0,
      }
      if (page < 1 || bunch < 5 || bunch > 100) {
        return fail(`Invalid parameters.`, response)
      }

      const maxCommentUid = await getMaxCommentUid()
      const comments = await getComments(page, bunch, maxCommentUid)

      return success({
        comments,
        maxCommentUid,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        page: t.Numeric(),
        bunch: t.Numeric(),
      }),
    },
  )
  .get(
    "/search/comment",
    async ({ query: { option, keyword, page, bunch } }) => {
      const response = {
        comments: [],
        maxCommentUid: 0,
      }

      if (option.length < 2 || keyword.length < 2 || page < 1 || bunch < 5 || bunch > 100) {
        return fail(`Invalid parameters.`, response)
      }

      const maxCommentUid = await getMaxCommentUid()
      const comments = await getSearchedComments({
        option,
        keyword,
        page,
        bunch,
        maxUid: maxCommentUid,
      })
      return success({
        comments,
        maxCommentUid,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        option: t.String(),
        keyword: t.String(),
        page: t.Numeric(),
        bunch: t.Numeric(),
      }),
    },
  )
