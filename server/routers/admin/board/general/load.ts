/**
 * server/routers/admin/board/general/load
 *
 * 게시판 관리화면 > 일반 > 불러오기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getBoardConfig } from "../../../../database/admin/board/general/load"
import { fail, success, DEFAULT_TYPE_CHECK } from "../../../../util/tools"
import { INIT_BOARD_CONFIG } from "../../../../database/admin/board/general/const"
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
        newAccessToken: "",
        config: INIT_BOARD_CONFIG,
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

      const config = await getBoardConfig(id)
      if (config.uid < 1) {
        return fail(`Invalid board ID.`, response)
      }

      return success({
        config,
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
