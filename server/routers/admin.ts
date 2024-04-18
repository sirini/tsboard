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
import { report } from "./admin/report"
import { user } from "./admin/user"
import { isValidRefreshToken } from "../database/auth/authorization"
import { fail } from "../util/tools"
import { haveAdminPermission } from "../database/user/manageuser"
import { NO_TABLE_TARGET } from "../database/user/const"

export const admin = new Elysia().group("/admin", (app) => {
  return app
    .use(
      jwt({
        name: "jwt",
        secret: process.env.JWT_SECRET_KEY!,
      }),
    )
    .onBeforeHandle(async ({ cookie: { refresh }, jwt, headers }) => {
      const response = ""
      const access = await jwt.verify(headers.authorization ?? "")
      if (access === false) {
        return fail(`Invalid authorization.`, response)
      }

      const userUid = access.uid as number
      if ((await haveAdminPermission(userUid, NO_TABLE_TARGET)) === false) {
        return fail(`Access denied.`, response)
      }

      const now = Date.now()
      const accessTokenTime = access.signin as number

      if (accessTokenTime < now) {
        if ((await isValidRefreshToken(userUid, refresh.value)) === false) {
          return fail(`Invalid refresh token.`, response)
        }
      }
    })
    .use(dashboard)
    .use(board)
    .use(group)
    .use(latest)
    .use(report)
    .use(user)
})
