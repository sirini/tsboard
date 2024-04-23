/**
 * server/routers/admin/board/point/update
 *
 * 게시판 관리화면 > 포인트 > 업데이트 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { updatePoints } from "../../../../database/admin/board/point/update"
import { fail, success, EXTEND_TYPE_CHECK } from "../../../../util/tools"
import { AdminBoardPointList } from "../../../../../src/interface/admin"
import { checkUserVerification } from "../../../../database/auth/authorization"
import { haveAdminPermission } from "../../../../database/user/manageuser"
import { NO_TABLE_TARGET } from "../../../../database/user/const"

export const update = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .patch(
    "/update/points",
    async ({
      jwt,
      cookie: { refresh },
      headers: { authorization },
      body: { boardUid, points },
      query: { userUid },
    }) => {
      const response = {
        newAccessToken: "",
      }

      if (boardUid < 1) {
        return fail(`Invalid board uid.`, response)
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

      const pointKeys = Object.values(points)
      for (const point of pointKeys) {
        if (point.amount < 0 || point.amount > 10_000) {
          return fail(`Invalid point value. (0 ≤ point ≤ 10,000)`, response)
        }
      }
      updatePoints(boardUid, points as AdminBoardPointList)

      return success({
        newAccessToken: verification.newAccessToken,
      })
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Number(),
        points: t.Object({
          view: t.Object({
            isPayment: t.Boolean(),
            amount: t.Number(),
          }),
          write: t.Object({
            isPayment: t.Boolean(),
            amount: t.Number(),
          }),
          comment: t.Object({
            isPayment: t.Boolean(),
            amount: t.Number(),
          }),
          download: t.Object({
            isPayment: t.Boolean(),
            amount: t.Number(),
          }),
        }),
      }),
    },
  )
