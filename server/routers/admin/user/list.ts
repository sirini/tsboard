/**
 * server/routers/admin/user/list
 *
 * 회원 목록과 관련된 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getMaxUserUid, getUsers, getSearchedUsers } from "../../../database/admin/user/list"
import { fail, success, getUpdatedAccessToken } from "../../../util/tools"

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
      const response = {
        newAccessToken: "",
        users: [],
        maxUserUid: 0,
      }

      if (page < 1) {
        return fail(`Invalid page.`, response)
      }
      if (bunch < 5 || bunch > 100) {
        return fail(`Invalid bunch.`, response)
      }
      const blocked = isBlocked > 0 ? true : false
      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
      const maxUserUid = await getMaxUserUid(blocked)
      const users = await getUsers({
        page,
        bunch,
        maxUid: maxUserUid,
        option: "",
        keyword: "",
        isBlocked: blocked,
      })

      return success({
        newAccessToken,
        users,
        maxUserUid,
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
