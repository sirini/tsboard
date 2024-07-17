/**
 * server/routers/admin/user/list
 *
 * 회원 목록과 관련된 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getMaxUserUid, getUsers } from "../../../database/admin/user/list"
import { fail, success, DEFAULT_TYPE_CHECK } from "../../../util/tools"
import { checkUserVerification } from "../../../database/auth/authorization"
import { haveAdminPermission } from "../../../database/user/manageuser"
import { NO_TABLE_TARGET } from "../../../database/user/const"

export const list = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/list",
    async ({
      jwt,
      cookie: { refresh },
      headers: { authorization },
      query: { page, bunch, isBlocked, userUid },
    }) => {
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

      const verification = await checkUserVerification({
        jwt,
        userUid,
        accessToken: authorization,
        refreshToken: refresh.value ?? "",
      })

      if (verification.success === false) {
        return fail(`Unauthorized access.`, response)
      }

      if ((await haveAdminPermission(verification.accessUserUid, NO_TABLE_TARGET)) === false) {
        return fail(`Access denied, only administrator can access.`, response)
      }

      const blocked = isBlocked > 0 ? true : false
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
        newAccessToken: verification.newAccessToken,
        users,
        maxUserUid,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        page: t.Numeric(),
        bunch: t.Numeric(),
        isBlocked: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )
