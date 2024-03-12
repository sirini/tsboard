/**
 * server/routers/admin/board/point/update
 *
 * 게시판 관리화면 > 포인트 > 업데이트 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { updatePoints } from "../../../../database/admin/board/point/update"
import { fail, success, getUpdatedAccessToken, DEFAULT_TYPE_CHECK } from "../../../../util/tools"
import { AdminBoardPointList } from "../../../../../src/interface/admin"

export const update = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .patch(
    "/updatepoints",
    async ({ jwt, cookie: { refresh }, headers, body: { boardUid, points } }) => {
      const response = {
        newAccessToken: "",
      }

      if (boardUid < 1) {
        return fail(`Invalid board uid.`, response)
      }
      const pointKeys = Object.values(points)
      for (const point of pointKeys) {
        if (point.amount < 0 || point.amount > 10_000) {
          return fail(`Invalid point value. (0 ≤ point ≤ 10,000)`, response)
        }
      }
      updatePoints(boardUid, points as AdminBoardPointList)
      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        newAccessToken,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
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
