/**
 * server/routers/admin/board/general/update
 *
 * 게시판 관리화면 > 일반 > 업데이트 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { changeGroup } from "../../../../database/admin/board/general/update"
import { fail, success, updateAccessToken } from "../../../../util/tools"

export const update = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .patch(
    "/changegroup",
    async ({ jwt, cookie: { refresh }, headers, body }) => {
      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      if (body.groupUid < 1 || body.boardUid < 1) {
        return fail(`Invalid target.`)
      }

      changeGroup(body.groupUid, body.boardUid)

      return success({
        newAccessToken,
      })
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      body: t.Object({
        groupUid: t.Number(),
        boardUid: t.Number(),
      }),
      cookie: t.Cookie({
        refresh: t.String(),
      }),
    },
  )
