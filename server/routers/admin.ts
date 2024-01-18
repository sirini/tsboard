/**
 * server/routers/admin
 *
 * 관리화면에 연관된 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { board } from "./admin/board"
import { group } from "./admin/group"
import { isValidRefreshToken } from "../database/auth/authorization"
import { fail } from "../util/tools"

export const admin = new Elysia().group("/admin", (app) => {
  return app
    .use(
      jwt({
        name: "jwt",
        secret: process.env.JWT_SECRET_KEY!,
      }),
    )
    .onBeforeHandle(async ({ set, cookie: { refresh }, jwt, headers }) => {
      const access = await jwt.verify(headers.authorization)
      if (access === false) {
        set.status = "Unauthorized"
        return fail(`Invalid authorization.`)
      }

      const userUid = access.uid as number
      if (userUid !== 1) {
        set.status = "Unauthorized"
        return fail(`Not an admin.`)
      }

      const now = Date.now()
      const accessTokenTime = access.signin as number

      if (accessTokenTime < now) {
        if ((await isValidRefreshToken(userUid, refresh.value)) === false) {
          return fail(`Invalid refresh token.`)
        }
      }
    })
    .use(board)
    .use(group)
})
