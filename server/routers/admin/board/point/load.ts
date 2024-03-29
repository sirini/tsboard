/**
 * server/routers/admin/board/point/load
 *
 * 게시판 관리화면 > 포인트 > 불러오기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getPointConfig } from "../../../../database/admin/board/point/load"
import { fail, success, getUpdatedAccessToken } from "../../../../util/tools"
import { INIT_POINT_CONFIG } from "../../../../database/admin/board/point/const"

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
      const response = {
        point: INIT_POINT_CONFIG,
        newAccessToken: "",
      }

      const point = await getPointConfig(id)
      if (point.uid < 1) {
        return fail(`Invalid board ID.`, response)
      }

      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
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
