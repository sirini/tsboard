/**
 * server/routers/admin
 *
 * 관리화면에 연관된 라우팅 처리
 */

import { Elysia } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { dashboard } from "./admin/dashboard"
import { board } from "./admin/board"
import { group } from "./admin/group"
import { latest } from "./admin/latest"
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
    .onBeforeHandle(async ({ cookie: { refresh }, jwt, headers }) => {
      const access = await jwt.verify(headers.authorization ?? "")
      if (access === false) {
        return fail(`Invalid authorization.`)
      }

      const userUid = access.uid as number
      if (userUid !== 1) {
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
    .use(dashboard)
    .use(board)
    .use(group)
    .use(latest)
})
