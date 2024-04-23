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
import { fail, success, DEFAULT_TYPE_CHECK } from "../../../../util/tools"
import { INIT_PERMISSION_CONFIG } from "../../../../database/admin/board/permission/const"
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
    async ({ jwt, cookie: { refresh }, headers: { authorization }, query: { id, userUid } }) => {
      let response = {
        permission: INIT_PERMISSION_CONFIG,
        newAccessToken: "",
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

      if (id.length < 2) {
        return fail(`Board ID is too short.`, response)
      }

      const permission = await getBoardPermission(id)
      if (permission.uid < 1) {
        return fail(`Invalid board ID.`, response)
      }

      return success({
        permission,
        newAccessToken: verification.newAccessToken,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        id: t.String(),
        userUid: t.Numeric(),
      }),
    },
  )
  .get(
    "/candidates",
    async ({ query: { name, limit } }) => {
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
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        name: t.String(),
        limit: t.Numeric(),
      }),
    },
  )
