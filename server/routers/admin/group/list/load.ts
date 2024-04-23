/**
 * server/routers/admin/group/list/load
 *
 * 그룹 목록 등 불러오기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getGroupList, getExistGroupIds } from "../../../../database/admin/group/list/load"
import { fail, success, DEFAULT_TYPE_CHECK, EXTEND_TYPE_CHECK } from "../../../../util/tools"
import { checkUserVerification } from "../../../../database/auth/authorization"
import { haveAdminPermission } from "../../../../database/user/manageuser"
import { NO_TABLE_TARGET } from "../../../../database/user/const"

export const load = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/load",
    async ({ jwt, cookie: { refresh }, headers: { authorization }, query: { userUid } }) => {
      const response = {
        newAccessToken: "",
        groups: [],
      }

      const groups = await getGroupList()
      if (groups.length < 1) {
        return fail(`Unable to get group list.`, response)
      }

      const verification = await checkUserVerification({
        jwt,
        userUid,
        accessToken: authorization,
        refreshToken: refresh.value,
      })

      if (verification.success === false) {
        return fail(`Unauthorized access.`, response)
      }

      if ((await haveAdminPermission(verification.accessUserUid, NO_TABLE_TARGET)) === false) {
        return fail(`Access denied, only administrator can access.`, response)
      }

      return success({
        newAccessToken: verification.newAccessToken,
        groups,
      })
    },
    {
      ...EXTEND_TYPE_CHECK,
    },
  )
  .get(
    "/groupids",
    async ({ query: { id, limit } }) => {
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
