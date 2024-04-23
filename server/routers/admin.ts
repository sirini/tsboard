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

export const admin = new Elysia().group("/admin", (app) => {
  return app
    .use(
      jwt({
        name: "jwt",
        secret: process.env.JWT_SECRET_KEY!,
      }),
    )
    .use(dashboard)
    .use(board)
    .use(group)
    .use(latest)
    .use(report)
    .use(user)
})
