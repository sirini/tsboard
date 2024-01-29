/**
 * server/routers/admin/board/general/load
 *
 * 게시판 관리화면 > 일반 > 불러오기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getBoardConfig } from "../../../../database/admin/board/general/load"
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
      const config = await getBoardConfig(id)
      if (config.uid < 1) {
        return fail(`Invalid board ID.`)
      }

      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        config,
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
