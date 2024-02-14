/**
 * server/routers/admin/board/permission/load
 *
 * 게시판 관리화면 > 권한 > 불러오기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import {
  getAdminCandidates,
  getBoardPermission,
} from "../../../../database/admin/board/permission/load"
import { fail, success, getUpdatedAccessToken } from "../../../../util/tools"

const defaultTypeCheck = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
}

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
      if (id.length < 2) {
        return fail(`Board ID is too short.`)
      }

      const permission = await getBoardPermission(id)
      if (permission.uid < 1) {
        return fail(`Invalid board ID.`)
      }

      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        permission,
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
  .get(
    "/candidates",
    async ({ jwt, cookie: { refresh }, headers, query: { name, limit } }) => {
      if (name.length < 2) {
        return fail(`name is too short.`)
      }
      if (limit < 1) {
        return fail(`Invalid a limit.`)
      }
      const candidates = await getAdminCandidates(name, limit)

      return success({
        candidates,
      })
    },
    {
      ...defaultTypeCheck,
      query: t.Object({
        name: t.String(),
        limit: t.Numeric(),
      }),
    },
  )
