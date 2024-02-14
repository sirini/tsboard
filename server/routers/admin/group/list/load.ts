/**
 * server/routers/admin/group/list/load
 *
 * 그룹 목록 등 불러오기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getGroupList, getExistGroupIds } from "../../../../database/admin/group/list/load"
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
    async ({ jwt, cookie: { refresh }, headers }) => {
      const groups = await getGroupList()
      if (groups.length < 1) {
        return fail(`Unable to get group list.`)
      }

      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        newAccessToken,
        groups,
      })
    },
    {
      ...defaultTypeCheck,
    },
  )
  .get(
    "/groupids",
    async ({ jwt, cookie: { refresh }, headers, query: { id, limit } }) => {
      if (id.length < 2) {
        return fail(`Group id is too short.`)
      }
      const ids = await getExistGroupIds(id, limit)
      return success({
        ids,
      })
    },
    {
      ...defaultTypeCheck,
      query: t.Object({
        id: t.String(),
        limit: t.Numeric(),
      }),
    },
  )
