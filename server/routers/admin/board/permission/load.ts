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
import { INIT_PERMISSION_CONFIG } from "../../../../database/admin/board/permission/const"

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
      const response = {
        permission: INIT_PERMISSION_CONFIG,
        newAccessToken: "",
      }

      if (id.length < 2) {
        return fail(`Board ID is too short.`, response)
      }

      const permission = await getBoardPermission(id)
      if (permission.uid < 1) {
        return fail(`Invalid board ID.`, response)
      }
      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        permission,
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      query: t.Object({
        id: t.String(),
      }),
    },
  )
  .get(
    "/candidates",
    async ({ jwt, cookie: { refresh }, headers, query: { name, limit } }) => {
      const response = {
        candidates: [],
      }

      if (name.length < 2) {
        return fail(`name is too short.`, response)
      }
      if (limit < 1) {
        return fail(`Invalid a limit.`, response)
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
