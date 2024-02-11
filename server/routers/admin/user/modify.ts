/**
 * server/routers/admin/user/modify
 *
 * 사용자 정보 수정과 관련된 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, updateAccessToken } from "../../../util/tools"
import { getUserInfo } from "../../../database/admin/user/modify"

const defaultTypeCheck = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
}

export const modify = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/load",
    async ({ jwt, cookie: { refresh }, headers, query: { userUid } }) => {
      if (userUid < 1) {
        return fail(`Invalid user uid.`)
      }
      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      const user = await getUserInfo(userUid)
      return success({
        newAccessToken,
        user,
      })
    },
    {
      ...defaultTypeCheck,
      query: t.Object({
        userUid: t.Numeric(),
      }),
    },
  )
  .patch(
    "/update",
    async ({
      jwt,
      cookie: { refresh },
      headers,
      body: { userUid, name, level, point, signature, password, newProfile },
    }) => {
      if (userUid < 1) {
        return fail(`Invalid user uid.`)
      }
      if (name.length < 2) {
        return fail(`Name is too short.`)
      }
      if (level < 0 || point < 0) {
        return fail(`Minus value is not allowed.`)
      }
      console.log(newProfile) // DEBUG
      return fail(`Not implemented yet.`)
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        userUid: t.Number(),
        name: t.String(),
        level: t.Number(),
        point: t.Number(),
        signature: t.String(),
        password: t.MaybeEmpty(t.String()),
        newProfile: t.MaybeEmpty(t.File()),
      }),
    },
  )
