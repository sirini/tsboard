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
  .resolve(async ({ jwt, headers, cookie }) => {
    let accessUserUid = 0
    let newAccessToken = ""

    if (headers.authorization !== undefined && cookie && cookie.refresh) {
      const access = await jwt.verify(headers.authorization)
      if (access !== false) {
        accessUserUid = access.uid as number
        newAccessToken = await getUpdatedAccessToken(
          jwt,
          headers.authorization,
          cookie.refresh.value,
        )
      }
    }
    return {
      accessUserUid,
      newAccessToken,
    }
  })
  .patch(
    "/changeadmin",
    async ({ body: { boardUid, userUid }, newAccessToken }) => {
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
    async ({ body: { boardUid, levels }, newAccessToken }) => {
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
