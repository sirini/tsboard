/**
 * server/routers/admin/group/general/update
 *
 * 특정 그룹에 대한 업데이트 작업 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, updateAccessToken } from "../../../../util/tools"
import { changeGroupAdmin, removeBoard } from "../../../../database/admin/group/general/update"

const defaultTypeCheck = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
}

export const update = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .patch(
    "/changeadmin",
    async ({ jwt, cookie: { refresh }, headers, body }) => {
      if (body.groupUid < 1) {
        return fail(`Invalid group uid.`)
      }
      if (body.userUid < 1) {
        return fail(`Invalid user uid.`)
      }

      const result = await changeGroupAdmin(body.groupUid, body.userUid)
      if (result === false) {
        return fail(`User not found.`)
      }

      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        groupUid: t.Number(),
        userUid: t.Number(),
      }),
    },
  )
  .delete(
    "/removeboard",
    async ({ jwt, cookie: { refresh }, headers, body }) => {
      if (body.boardUid < 1) {
        return fail(`Invalid board uid.`)
      }

      const result = await removeBoard(body.boardUid)
      if (result === false) {
        return fail(`Board not found.`)
      }

      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        boardUid: t.Number(),
      }),
    },
  )
