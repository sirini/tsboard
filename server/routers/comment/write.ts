import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import sanitizeHtml from "sanitize-html"
import { checkUserVerification } from "../../database/auth/authorization"
import {
  saveNewComment
} from "../../database/board/comment"
import { havePermission, updateUserPoint } from "../../database/board/common"
import { getUserLevel } from "../../database/board/list"
import { isBannedByWriter } from "../../database/board/view"
import {
  DEFAULT_HTML_FILTER,
  EXTEND_TYPE_CHECK,
  fail,
  success
} from "../../util/tools"

export const writeRouter = new Elysia()
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
      refreshToken: refresh.value ?? "",
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
  .post(
    "/write",
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
