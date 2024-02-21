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
  removeComment,
  saveModifyComment,
  saveNewComment,
  saveReplyComment,
} from "../../database/board/comment"
import { fail, getUpdatedAccessToken, success } from "../../util/tools"
import { checkUserPermission, updateUserPoint } from "../../database/board/common"

const htmlFilter = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  allowedAttributes: {
    code: ["class"],
    img: ["src", "alt", "class"],
    span: ["class"],
  },
}

const defaultTypeCheck = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
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

      if (id.length < 2 || postUid < 1 || page < 1 || bunch < 1) {
        return fail(`Invalid parameters.`, response)
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

      if (boardUid < 1 || commentUid < 1 || liked > 1 || liked < 0) {
        return fail(`Invalid parameters.`, response)
      }
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
      ...defaultTypeCheck,
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
      const response = { newCommentUid: 0, newAccessToken: "" }

      if (boardUid < 1 || postUid < 1 || content.length < 3) {
        return fail(`Invalid parameters.`, response)
      }
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }

      const updatePointResult = await updateUserPoint({
        boardUid,
        accessUserUid,
        action: "comment",
      })
      if (updatePointResult === false) {
        return fail(`Not enough point.`, response)
      }

      content = sanitizeHtml(content, htmlFilter)
      const newCommentUid = await saveNewComment({
        boardUid,
        postUid,
        accessUserUid,
        content,
      })
      return success({ newCommentUid, newAccessToken })
    },
    {
      ...defaultTypeCheck,
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
      const response = { newCommentUid: 0, newAccessToken: "" }
      if (boardUid < 1 || postUid < 1 || replyTargetUid < 1 || content.length < 3) {
        return fail(`Invalid parameters.`, response)
      }
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }

      const updatePointResult = await updateUserPoint({
        boardUid,
        accessUserUid,
        action: "comment",
      })
      if (updatePointResult === false) {
        return fail(`Not enough point.`, response)
      }

      content = sanitizeHtml(content, htmlFilter)
      const newCommentUid = await saveReplyComment({
        boardUid,
        postUid,
        replyTargetUid,
        accessUserUid,
        content,
      })
      return success({ newCommentUid, newAccessToken })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        boardUid: t.Numeric(),
        postUid: t.Numeric(),
        replyTargetUid: t.Numeric(),
        content: t.String(),
      }),
    },
  )
  .patch(
    "/modifycomment",
    async ({
      body: { boardUid, postUid, modifyTargetUid, content },
      accessUserUid,
      newAccessToken,
    }) => {
      const response = { newAccessToken }

      if (boardUid < 1 || postUid < 1 || modifyTargetUid < 1 || content.length < 3) {
        return fail(`Invalid parameters.`, response)
      }
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }

      const checkPermissionResult = await checkUserPermission({
        boardUid,
        targetTable: "comment",
        targetUid: modifyTargetUid,
        accessUserUid,
      })
      if (checkPermissionResult === false) {
        return fail(`No permission.`, response)
      }

      content = sanitizeHtml(content, htmlFilter)
      await saveModifyComment({ modifyTargetUid, content })
      return success(response)
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        boardUid: t.Numeric(),
        postUid: t.Numeric(),
        modifyTargetUid: t.Numeric(),
        content: t.String(),
      }),
    },
  )
  .delete(
    "/removecomment",
    async ({ query: { boardUid, removeTargetUid }, accessUserUid, newAccessToken }) => {
      const response = { newAccessToken, isChangeStatus: false }

      if (boardUid < 1 || removeTargetUid < 1) {
        return fail(`Invalid parameters.`, response)
      }

      const checkPermissionResult = await checkUserPermission({
        boardUid,
        targetTable: "comment",
        targetUid: removeTargetUid,
        accessUserUid,
      })
      if (checkPermissionResult === false) {
        return fail(`No permission.`, response)
      }

      const isChangeStatus = removeComment(removeTargetUid)
      return success({
        newAccessToken,
        isChangeStatus,
      })
    },
    {
      ...defaultTypeCheck,
      query: t.Object({
        boardUid: t.Numeric(),
        removeTargetUid: t.Numeric(),
      }),
    },
  )
