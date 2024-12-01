/**
 * server/routers/user/manageuser
 *
 * 회원 관리 기능과 관련된 라우팅 처리
 */

import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { checkUserVerification } from "../../database/auth/authorization"
import { NO_TABLE_TARGET, USER_PERMISSION_PARAMS } from "../../database/user/const"
import {
  getUserPermission,
  haveAdminPermission,
  updateUserPermission,
} from "../../database/user/manageuser"
import { DEFAULT_TYPE_CHECK, EXTEND_TYPE_CHECK, fail, success } from "../../util/tools"

export const manageUserRouter = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers: { authorization }, cookie: { refresh }, query: { userUid } }) => {
    let accessUserUid = 0
    let newAccessToken = ""

    const verification = await checkUserVerification({
      jwt,
      userUid: parseInt(userUid ?? "0"),
      accessToken: authorization ?? "",
      refreshToken: refresh.value ?? "",
    })

    if (verification.success === true) {
      accessUserUid = verification.accessUserUid
      newAccessToken = verification.newAccessToken
    }

    if ((await haveAdminPermission(accessUserUid, NO_TABLE_TARGET)) === false) {
      return {
        accessUserUid,
        newAccessToken,
      }
    }

    return {
      accessUserUid,
      newAccessToken,
    }
  })
  .get(
    "/load/permission",
    async ({ newAccessToken, query: { targetUserUid } }) => {
      let response = {
        newAccessToken: "",
        permission: USER_PERMISSION_PARAMS,
      }
      if (targetUserUid < 1) {
        return fail(`Invalid target user uid.`, response)
      }
      const permission = await getUserPermission(targetUserUid)
      return success({
        newAccessToken,
        permission,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        targetUserUid: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )
  .post(
    "/manage/user",
    async ({
      body: { userUid, writePost, writeComment, sendChatMessage, sendReport, login, response },
      accessUserUid,
      newAccessToken,
    }) => {
      const res = {
        newAccessToken: "",
      }
      if (userUid < 1) {
        return fail(`Invalid target user.`, res)
      }
      if (response.length < 3) {
        return fail(`Invalid content.`, res)
      }
      await updateUserPermission(
        {
          writePost,
          writeComment,
          sendChatMessage,
          sendReport,
          login,
          userUid,
          response,
        },
        accessUserUid,
      )
      return success({
        newAccessToken,
      })
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        userUid: t.Number(),
        writePost: t.Boolean(),
        writeComment: t.Boolean(),
        sendChatMessage: t.Boolean(),
        sendReport: t.Boolean(),
        login: t.Boolean(),
        response: t.String(),
      }),
    },
  )
