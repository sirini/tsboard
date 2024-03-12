/**
 * server/routers/admin/group/list/load
 *
 * 그룹 목록 등 불러오기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getGroupList, getExistGroupIds } from "../../../../database/admin/group/list/load"
import { fail, success, getUpdatedAccessToken, DEFAULT_TYPE_CHECK } from "../../../../util/tools"

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
      const response = {
        newAccessToken: "",
        groups: [],
      }

      const groups = await getGroupList()
      if (groups.length < 1) {
        return fail(`Unable to get group list.`, response)
      }
      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        newAccessToken,
        groups,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
    },
  )
  .get(
    "/groupids",
    async ({ jwt, cookie: { refresh }, headers, query: { id, limit } }) => {
      const response = {
        ids: [],
      }

      if (id.length < 2) {
        return fail(`Group id is too short.`, response)
      }
      const ids = await getExistGroupIds(id, limit)
      return success({
        ids,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        id: t.String(),
        limit: t.Numeric(),
      }),
    },
  )
