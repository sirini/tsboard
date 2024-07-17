/**
 * server/routers/admin/board/point/load
 *
 * 게시판 관리화면 > 포인트 > 불러오기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getPointConfig } from "../../../../database/admin/board/point/load"
import { fail, success, DEFAULT_TYPE_CHECK } from "../../../../util/tools"
import { INIT_POINT_CONFIG } from "../../../../database/admin/board/point/const"
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
      const response = {
        point: INIT_POINT_CONFIG,
        newAccessToken: "",
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

      const point = await getPointConfig(id)
      if (point.uid < 1) {
        return fail(`Invalid board ID.`, response)
      }

      return success({
        point,
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
