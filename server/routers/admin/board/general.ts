/**
 * server/routers/admin/board/general
 *
 * 게시판 관리화면 > 일반 부분 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"

export const general = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/config",
    async ({ jwt, cookie: { refresh }, headers }) => {
      const access = await jwt.verify(headers.authorization)

      if (!access) {
        console.log(`access is not valid`)
      }

      console.log(`refresh.value.signin = ${refresh.value.signin}`)
      console.log(`headers.authorization = ${headers.authorization}`)
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      cookie: t.Object({
        refresh: t.Object({
          signin: t.Numeric(),
        }),
      }),
    },
  )
