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
  getPostInfo,
  getTotalCommentCount,
  getViewPostLevel,
  likeComment,
  removeComment,
  saveModifyComment,
  saveNewComment,
  saveReplyComment,
} from "../../database/board/comment"
import {
  fail,
  success,
  DEFAULT_TYPE_CHECK,
  EXTEND_TYPE_CHECK,
  DEFAULT_HTML_FILTER,
} from "../../util/tools"
import { checkUserPermission, havePermission, updateUserPoint } from "../../database/board/common"
import { Comment } from "../../../src/interface/board"
import { isBannedByWriter } from "../../database/board/view"
import { checkUserVerification } from "../../database/auth/authorization"
import { CONTENT_STATUS } from "../../database/board/const"
import { haveAdminPermission } from "../../database/user/manageuser"

export const comment = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers: { authorization }, cookie: { refresh }, query: { userUid } }) => {
    let accessUserUid = 0
    let userLevel = 0
    let newAccessToken = ""

    const verification = await checkUserVerification({
      jwt,
      userUid: parseInt(userUid ?? "0"),
      accessToken: authorization ?? "",
      refreshToken: refresh.value,
    })

    if (verification.success === true) {
      accessUserUid = verification.accessUserUid
      userLevel = await getUserLevel(accessUserUid)
      newAccessToken = verification.newAccessToken
    }

    return {
      accessUserUid,
      userLevel,
      newAccessToken,
    }
  })
  .get(
    "/comment",
    async ({
      query: { postUid, id, page, bunch, pagingDirection, sinceUid },
      accessUserUid,
      userLevel,
    }) => {
      const response = {
        boardUid: 0,
        sinceUid: 0,
        comments: [] as Comment[],
        totalCommentCount: 0,
      }

      if (id.length < 2 || postUid < 1 || page < 1 || bunch < 1 || sinceUid < 0) {
        return fail(`Invalid parameters.`, response)
      }

      response.boardUid = await getBoardUid(id)
      const configViewLevel = await getViewPostLevel(response.boardUid)
      if (configViewLevel > userLevel) {
        return fail(`Level restriction.`, response)
      }

      const post = await getPostInfo(postUid)
      const isAdmin = await haveAdminPermission(accessUserUid, response.boardUid)
      if (post.status === CONTENT_STATUS.SECRET) {
        if (accessUserUid !== post.writerUid && isAdmin === false) {
          return fail(`You don't have permission to read comments.`, response)
        }
      }

      if (post.status === CONTENT_STATUS.REMOVED) {
        return fail(`Post has been removed.`, response)
      }

      if (sinceUid < 1) {
        sinceUid = (await getMaxCommentUid(postUid)) + 1
      }
      response.totalCommentCount = await getTotalCommentCount(postUid)
      response.comments = await getComments({
        postUid,
        page,
        bunch,
        sinceUid,
        accessUserUid,
        pagingDirection,
      })
      return success(response)
    },
    {
      query: t.Object({
        id: t.String(),
        postUid: t.Numeric(),
        page: t.Numeric(),
        pagingDirection: t.Numeric(),
        sinceUid: t.Numeric(),
        bunch: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )
  .patch(
    "/like/comment",
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
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        commentUid: t.Numeric(),
        liked: t.Numeric(),
      }),
    },
  )
  .post(
    "/new/comment",
    async ({ body: { boardUid, postUid, content }, accessUserUid, newAccessToken }) => {
      const response = { newCommentUid: 0, newAccessToken: "" }

      if (boardUid < 1 || postUid < 1 || content.trim().length < 3) {
        return fail(`Invalid parameters.`, response)
      }
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }
      if ((await havePermission(accessUserUid, "write_comment")) === false) {
        return fail(`You have no permission.`, response)
      }
      if ((await isBannedByWriter(postUid, accessUserUid)) === true) {
        return fail(`You have been blocked.`, response)
      }

      const updatePointResult = await updateUserPoint({
        boardUid,
        accessUserUid,
        action: "comment",
      })
      if (updatePointResult === false) {
        return fail(`Not enough point.`, response)
      }

      content = sanitizeHtml(content, DEFAULT_HTML_FILTER)
      const newCommentUid = await saveNewComment({
        boardUid,
        postUid,
        accessUserUid,
        content,
      })
      return success({ newCommentUid, newAccessToken })
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        postUid: t.Numeric(),
        content: t.String(),
      }),
    },
  )
  .post(
    "/reply/comment",
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
      if ((await havePermission(accessUserUid, "write_comment")) === false) {
        return fail(`You have no permission.`, response)
      }
      if ((await isBannedByWriter(postUid, accessUserUid)) === true) {
        return fail(`You have been blocked.`, response)
      }

      const updatePointResult = await updateUserPoint({
        boardUid,
        accessUserUid,
        action: "comment",
      })
      if (updatePointResult === false) {
        return fail(`Not enough point.`, response)
      }

      content = sanitizeHtml(content, DEFAULT_HTML_FILTER)
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
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        postUid: t.Numeric(),
        replyTargetUid: t.Numeric(),
        content: t.String(),
      }),
    },
  )
  .patch(
    "/modify/comment",
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
      if ((await havePermission(accessUserUid, "write_comment")) === false) {
        return fail(`You have no permission.`, response)
      }
      if ((await isBannedByWriter(postUid, accessUserUid)) === true) {
        return fail(`You have been blocked.`, response)
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

      content = sanitizeHtml(content, DEFAULT_HTML_FILTER)
      await saveModifyComment({ modifyTargetUid, content })
      return success(response)
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        postUid: t.Numeric(),
        modifyTargetUid: t.Numeric(),
        content: t.String(),
      }),
    },
  )
  .delete(
    "/remove/comment",
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

      const isChangeStatus = await removeComment(removeTargetUid)
      return success({
        newAccessToken,
        isChangeStatus,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        boardUid: t.Numeric(),
        removeTargetUid: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )
