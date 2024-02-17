/**
 * server/routers/board/comment
 *
 * 댓글 관련 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getUserLevel } from "../../database/board/list"
import {
  getBoardUid,
  getComments,
  getMaxCommentUid,
  getViewPostLevel,
  likeComment,
} from "../../database/board/comment"
import { fail, success } from "../../util/tools"

const optionalHeaders = {
  headers: t.Optional(
    t.Object({
      authorization: t.String(),
    }),
  ),
  cookie: t.Optional(
    t.Cookie({
      refresh: t.String(),
    }),
  ),
}

export const comment = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .state("accessUserUid", 0)
  .state("userLevel", 0)
  .onBeforeHandle(async ({ jwt, cookie: { refresh }, headers, store }) => {
    if (headers.authorization !== undefined && refresh.value.length > 0) {
      const access = await jwt.verify(headers.authorization)
      if (access !== false) {
        store.accessUserUid = access.uid as number
        store.userLevel = await getUserLevel(store.accessUserUid)
      }
    }
  })
  .get(
    "/comment",
    async ({
      jwt,
      cookie: { refresh },
      headers,
      query: { postUid, id, page, bunch },
      store: { accessUserUid, userLevel },
    }) => {
      if (id.length < 2) {
        return fail(`Invalid board ID.`)
      }
      if (postUid < 1) {
        return fail(`Invalid post uid.`)
      }

      const boardUid = await getBoardUid(id)
      const configViewLevel = await getViewPostLevel(boardUid)
      if (configViewLevel > userLevel) {
        return fail(`Level restriction.`)
      }

      const maxCommentUid = await getMaxCommentUid(postUid)
      const comments = await getComments({
        postUid,
        page,
        bunch,
        maxUid: maxCommentUid,
        accessUserUid,
      })
      return success({
        boardUid,
        comments,
        maxCommentUid,
      })
    },
    {
      ...optionalHeaders,
      query: t.Object({
        id: t.String(),
        postUid: t.Numeric(),
        page: t.Numeric(),
        bunch: t.Numeric(),
      }),
    },
  )
  .patch(
    "/likecomment",
    async ({
      jwt,
      cookie: { refresh },
      headers,
      body: { boardUid, commentUid, liked },
      store: { accessUserUid },
    }) => {
      if (accessUserUid < 1) {
        return fail(`Please log in.`)
      }
      likeComment({
        boardUid,
        commentUid,
        accessUserUid,
        liked,
      })
      return success({})
    },
    {
      ...optionalHeaders,
      body: t.Object({
        boardUid: t.Numeric(),
        commentUid: t.Numeric(),
        liked: t.Numeric(),
      }),
    },
  )
