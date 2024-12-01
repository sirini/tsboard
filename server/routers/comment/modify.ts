import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import sanitizeHtml from "sanitize-html"
import { checkUserVerification } from "../../database/auth/authorization"
import {
  saveModifyComment
} from "../../database/board/comment"
import { checkUserPermission, havePermission } from "../../database/board/common"
import { getUserLevel } from "../../database/board/list"
import { isBannedByWriter } from "../../database/board/view"
import {
  DEFAULT_HTML_FILTER,
  EXTEND_TYPE_CHECK,
  fail,
  success
} from "../../util/tools"

export const modifyRouter = new Elysia()
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
  .patch(
    "/modify",
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