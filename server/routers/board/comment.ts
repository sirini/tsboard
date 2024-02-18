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

export const comment = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers, cookie }) => {
    let accessUserUid = 0
    let userLevel = 0

    if (headers.authorization !== undefined && cookie && cookie.refresh) {
      const access = await jwt.verify(headers.authorization)
      if (access !== false) {
        accessUserUid = access.uid as number
        userLevel = await getUserLevel(accessUserUid)
      }
    }
    return {
      accessUserUid,
      userLevel,
    }
  })
  .get(
    "/comment",
    async ({ query: { postUid, id, page, bunch }, accessUserUid, userLevel }) => {
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
      headers: t.Object({
        authorization: t.String(),
      }),
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
    async ({ body: { boardUid, commentUid, liked }, accessUserUid }) => {
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
      headers: t.Object({
        authorization: t.String(),
      }),
      body: t.Object({
        boardUid: t.Numeric(),
        commentUid: t.Numeric(),
        liked: t.Numeric(),
      }),
    },
  )
