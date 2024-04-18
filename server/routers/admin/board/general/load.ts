/**
 * server/routers/admin/board/general/load
 *
 * 게시판 관리화면 > 일반 > 불러오기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getBoardConfig } from "../../../../database/admin/board/general/load"
import { fail, success, getUpdatedAccessToken, DEFAULT_TYPE_CHECK } from "../../../../util/tools"
import { INIT_BOARD_CONFIG } from "../../../../database/admin/board/general/const"

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
        newAccessToken: "",
        config: INIT_BOARD_CONFIG,
      }

      const config = await getBoardConfig(id)
      if (config.uid < 1) {
        return fail(`Invalid board ID.`, response)
      }

      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        config,
        newAccessToken,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        id: t.String(),
      }),
    },
  )
