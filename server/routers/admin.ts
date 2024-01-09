/**
 * server/routers/admin
 *
 * 관리화면에 연관된 라우팅 처리
 */

import { Elysia } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { board } from "./admin/board"
import { isLoggedOut } from "../database/auth/authorization"
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
      const access = await jwt.verify(headers.authorization)
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
        if ((await isLoggedOut(userUid)) === true) {
          return fail(`Already logged out.`)
        }
        const refreshToken = await jwt.verify(refresh.value)
        if (refreshToken === false) {
          return fail(`Invalid token.`)
        }
        const refreshTokenTime = refreshToken.signin as number
        if (refreshTokenTime < now) {
          return fail(`Expired token.`)
        }
      }
    })
    .use(board)
})
