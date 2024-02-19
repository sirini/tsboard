/**
 * server/routers/board/comment
 *
 * 댓글 관련 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import sanitizeHtml from "sanitize-html"
import { getUserLevel } from "../../database/board/list"
import {
  getBoardUid,
  getComments,
  getMaxCommentUid,
  getViewPostLevel,
  likeComment,
  saveNewComment,
  saveReplyComment,
} from "../../database/board/comment"
import { fail, getUpdatedAccessToken, success } from "../../util/tools"

const htmlFilter = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  allowedAttributes: {
    code: ["class"],
    img: ["src", "alt", "class"],
    span: ["class"],
  },
}

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
    let newAccessToken = ""

    if (headers.authorization !== undefined && cookie && cookie.refresh) {
      const access = await jwt.verify(headers.authorization)
      if (access !== false) {
        accessUserUid = access.uid as number
        userLevel = await getUserLevel(accessUserUid)
        newAccessToken = await getUpdatedAccessToken(
          jwt,
          headers.authorization,
          cookie.refresh.value,
        )
      }
    }
    return {
      accessUserUid,
      userLevel,
      newAccessToken,
    }
  })
  .get(
    "/comment",
    async ({ query: { postUid, id, page, bunch }, accessUserUid, userLevel }) => {
      const response = {
        boardUid: 0,
        comments: [],
        maxCommentUid: 0,
      }

      if (id.length < 2) {
        return fail(`Invalid board ID.`, response)
      }
      if (postUid < 1) {
        return fail(`Invalid post uid.`, response)
      }

      const boardUid = await getBoardUid(id)
      const configViewLevel = await getViewPostLevel(boardUid)
      if (configViewLevel > userLevel) {
        return fail(`Level restriction.`, response)
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
      const response = ""
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }
      likeComment({
        boardUid,
        commentUid,
        accessUserUid,
        liked,
      })
      return success(response)
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
  .post(
    "/newcomment",
    async ({ body: { boardUid, postUid, content }, accessUserUid, newAccessToken }) => {
      const response = {
        newCommentUid: 0,
        newAccessToken: "",
      }
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }
      content = sanitizeHtml(content, htmlFilter)
      const newCommentUid = await saveNewComment({
        boardUid,
        postUid,
        accessUserUid,
        content,
      })
      return success({
        newCommentUid,
        newAccessToken,
      })
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      body: t.Object({
        boardUid: t.Numeric(),
        postUid: t.Numeric(),
        content: t.String(),
      }),
    },
  )
  .post(
    "/replycomment",
    async ({
      body: { boardUid, postUid, replyTargetUid, content },
      accessUserUid,
      newAccessToken,
    }) => {
      const response = {
        newCommentUid: 0,
        newAccessToken: "",
      }
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }
      if (replyTargetUid < 1) {
        return fail(`Invalid target uid.`, response)
      }
      content = sanitizeHtml(content, htmlFilter)
      const newCommentUid = await saveReplyComment({
        boardUid,
        postUid,
        replyTargetUid,
        accessUserUid,
        content,
      })
      return success({
        newCommentUid,
        newAccessToken,
      })
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      body: t.Object({
        boardUid: t.Numeric(),
        postUid: t.Numeric(),
        replyTargetUid: t.Numeric(),
        content: t.String(),
      }),
    },
  )
