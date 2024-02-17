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
import { fail, success, getUpdatedAccessToken } from "../../../../util/tools"
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
    async ({ jwt, cookie: { refresh }, headers, body: { boardUid, userUid } }) => {
      if (boardUid < 1) {
        return fail(`Invalid board uid.`)
      }
      if (userUid < 1) {
        return fail(`Invalid user uid.`)
      }

      const result = await changeBoardAdmin(boardUid, userUid)
      if (result === false) {
        return fail(`User not found.`)
      }

      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
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
    async ({ jwt, cookie: { refresh }, headers, body: { boardUid, levels } }) => {
      if (boardUid < 1) {
        return fail(`Invalid board uid.`)
      }
      const levelKeys = Object.values(levels)
      for (const level of levelKeys) {
        if (level < 0 || level > 9) {
          return fail(`Invalid level. (0 ≤ level ≤ 9)`)
        }
      }

      updatePermissionLevels(boardUid, levels as AdminPermissionLevel)
      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
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
