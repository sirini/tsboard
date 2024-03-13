/**
 * server/routers/user/manageuser
 *
 * 회원 관리 기능과 관련된 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, getUpdatedAccessToken, DEFAULT_TYPE_CHECK } from "../../util/tools"
import {
  getUserPermission,
  haveAdminPermission,
  updateUserPermission,
} from "../../database/user/manageuser"
import { USER_PERMISSION_PARAMS } from "../../database/user/const"

export const manageUser = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers, cookie }) => {
    let accessUserUid = 0
    let newAccessToken = ""

    const access = await jwt.verify(headers.authorization ?? "")
    if (access === false) {
      return {
        accessUserUid,
        newAccessToken,
      }
    }
    accessUserUid = access.uid as number
    if ((await haveAdminPermission(accessUserUid)) === false) {
      return {
        accessUserUid,
        newAccessToken,
      }
    }
    if (cookie && cookie.refresh) {
      newAccessToken = await getUpdatedAccessToken(
        jwt,
        headers.authorization as string,
        cookie.refresh.value,
      )
    }
    return {
      accessUserUid,
      newAccessToken,
    }
  })
  .get(
    "/loadpermission",
    async ({ newAccessToken, query: { userUid } }) => {
      let response = {
        newAccessToken: "",
        permission: USER_PERMISSION_PARAMS,
      }
      if (userUid < 1) {
        return fail(`Invalid user uid.`, response)
      }
      const permission = await getUserPermission(userUid)
      return success({
        newAccessToken,
        permission,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        userUid: t.Numeric(),
      }),
    },
  )
  .post(
    "/manageuser",
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
      ...DEFAULT_TYPE_CHECK,
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
