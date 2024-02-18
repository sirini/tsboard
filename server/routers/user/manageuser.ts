/**
 * server/routers/user/manageuser
 *
 * 회원 관리 기능과 관련된 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, getUpdatedAccessToken } from "../../util/tools"
import {
  getUserPermission,
  hasPermission,
  updateUserPermission,
} from "../../database/user/manageuser"

const defaultTypeCheck = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
}

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
    if ((await hasPermission(accessUserUid)) === false) {
      return {
        accessUserUid,
        newAccessToken,
      }
    }
    accessUserUid = accessUserUid
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
      if (userUid < 1) {
        return fail(`Invalid user uid.`)
      }
      const permission = await getUserPermission(userUid)
      return success({
        newAccessToken,
        permission,
      })
    },
    {
      ...defaultTypeCheck,
      query: t.Object({
        userUid: t.Numeric(),
      }),
    },
  )
  .post(
    "/manageuser",
    async ({
      body: { userUid, writePost, writeComment, sendNote, sendReport, login, response },
      accessUserUid,
      newAccessToken,
    }) => {
      if (userUid < 1) {
        return fail(`Invalid target user.`)
      }
      if (response.length < 3) {
        return fail(`Invalid content.`)
      }
      await updateUserPermission(
        {
          writePost,
          writeComment,
          sendNote,
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
      ...defaultTypeCheck,
      body: t.Object({
        userUid: t.Number(),
        writePost: t.Boolean(),
        writeComment: t.Boolean(),
        sendNote: t.Boolean(),
        sendReport: t.Boolean(),
        login: t.Boolean(),
        response: t.String(),
      }),
    },
  )
