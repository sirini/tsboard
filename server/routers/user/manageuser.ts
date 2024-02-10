/**
 * server/routers/user/manageuser
 *
 * 회원 관리 기능과 관련된 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, updateAccessToken } from "../../util/tools"
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
  .state("accessUserUid", 0)
  .state("newAccessToken", "")
  .onBeforeHandle(async ({ cookie: { refresh }, jwt, headers, store }) => {
    const access = await jwt.verify(headers.authorization ?? "")
    if (access === false) {
      return fail(`Invalid authorization.`)
    }
    const accessUserUid = access.uid as number
    if ((await hasPermission(accessUserUid)) === false) {
      return fail(`Access denied.`)
    }
    store.accessUserUid = accessUserUid
    store.newAccessToken = await updateAccessToken(
      jwt,
      headers.authorization as string,
      refresh.value,
    )
  })
  .get(
    "/loadpermission",
    async ({ jwt, cookie: { refresh }, headers, query: { userUid }, store }) => {
      if (userUid < 1) {
        return fail(`Invalid user uid.`)
      }
      const permission = await getUserPermission(userUid)
      return success({
        newAccessToken: store.newAccessToken,
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
    async ({ jwt, cookie: { refresh }, headers, body, store }) => {
      if (body.userUid < 1) {
        return fail(`Invalid target user.`)
      }
      if (body.reason.length < 3) {
        return fail(`Invalid content.`)
      }
      await updateUserPermission(
        {
          writePost: body.writePost,
          writeComment: body.writeComment,
          sendNote: body.sendNote,
          sendReport: body.sendReport,
          login: body.login,
          userUid: body.userUid,
          reason: body.reason,
        },
        store.accessUserUid,
      )
      return success({
        newAccessToken: store.newAccessToken,
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
        reason: t.String(),
      }),
    },
  )
