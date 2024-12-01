/**
 * server/routers/board/comment
 *
 * 댓글 관련 라우팅 처리
 */

import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { checkUserVerification } from "../../database/auth/authorization"
import {
  removeComment
} from "../../database/board/comment"
import { checkUserPermission } from "../../database/board/common"
import { getUserLevel } from "../../database/board/list"
import {
  DEFAULT_TYPE_CHECK,
  fail,
  success
} from "../../util/tools"

export const removeRouter = new Elysia()
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
  .delete(
    "/remove",
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
