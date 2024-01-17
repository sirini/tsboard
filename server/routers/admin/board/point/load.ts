/**
 * server/routers/admin/board/point/load
 *
 * 게시판 관리화면 > 포인트 > 불러오기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getPointConfig } from "../../../../database/admin/board/point/load"
import { fail, success, updateAccessToken } from "../../../../util/tools"

export const load = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/load",
    async ({ jwt, cookie: { refresh }, headers, query: { id } }) => {
      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      const point = await getPointConfig(id)
      if (point.uid < 1) {
        return fail(`Invalid board ID.`)
      }

      return success({
        point,
        newAccessToken,
      })
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      cookie: t.Cookie({
        refresh: t.String(),
      }),
      query: t.Object({
        id: t.String(),
      }),
    },
  )
