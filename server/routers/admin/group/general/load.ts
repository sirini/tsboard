/**
 * server/routers/admin/group/general
 *
 * 특정 그룹에 대한 관리화면 불러오기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, updateAccessToken } from "../../../../util/tools"
import { getGroupBoards, getGroupConfig } from "../../../../database/admin/group/general/load"

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
      const config = await getGroupConfig(id)
      if (config.uid < 1) {
        return fail(`Invalid group ID.`)
      }
      const boards = await getGroupBoards(config.uid)

      return success({
        newAccessToken,
        config,
        boards,
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
