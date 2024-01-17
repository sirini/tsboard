/**
 * server/routers/admin/board/permission/update
 *
 * 게시판 관리화면 > 권한 > 업데이트 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import {
  changeBoardAdmin,
  updatePermissionLevels,
} from "../../../../database/admin/board/permission/update"
import { fail, success, updateAccessToken } from "../../../../util/tools"
import { AdminPermissionLevel } from "../../../../../src/interface/admin"

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
      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      if (body.boardUid < 1) {
        return fail(`Invalid board uid.`)
      }
      if (body.userUid < 1) {
        return fail(`Invalid user uid.`)
      }

      const result = await changeBoardAdmin(body.boardUid, body.userUid)
      if (result === false) {
        return fail(`User not found.`)
      }

      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        boardUid: t.Number(),
        userUid: t.Number(),
      }),
    },
  )
  .patch(
    "/updatelevels",
    async ({ jwt, cookie: { refresh }, headers, body }) => {
      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      if (body.boardUid < 1) {
        return fail(`Invalid board uid.`)
      }
      const levels = Object.values(body.levels)
      for (const level of levels) {
        if (level < 0 || level > 9) {
          return fail(`Invalid level. (0 ≤ level ≤ 9)`)
        }
      }

      updatePermissionLevels(body.boardUid, body.levels as AdminPermissionLevel)

      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        boardUid: t.Number(),
        levels: t.Object({
          list: t.Number(),
          view: t.Number(),
          write: t.Number(),
          comment: t.Number(),
          download: t.Number(),
        }),
      }),
    },
  )
