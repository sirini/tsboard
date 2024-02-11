/**
 * server/routers/admin/user/list
 *
 * 회원 목록과 관련된 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getTotalUserCount, getUsers, getSearchedUsers } from "../../../database/admin/user/list"
import { fail, success, updateAccessToken } from "../../../util/tools"

const defaultTypeCheck = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
}

export const list = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/list",
    async ({ jwt, cookie: { refresh }, headers, query: { page, bunch, isBlocked } }) => {
      if (page < 1) {
        return fail(`Invalid page.`)
      }
      if (bunch < 5 || bunch > 100) {
        return fail(`Invalid bunch.`)
      }
      const blocked = isBlocked > 0 ? true : false
      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      const totalUserCount = await getTotalUserCount(blocked)
      const users = await getUsers({
        page,
        bunch,
        total: totalUserCount,
        option: "",
        keyword: "",
        isBlocked: blocked,
      })

      return success({
        newAccessToken,
        users,
        totalUserCount,
      })
    },
    {
      ...defaultTypeCheck,
      query: t.Object({
        page: t.Numeric(),
        bunch: t.Numeric(),
        isBlocked: t.Numeric(),
      }),
    },
  )
