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
import { fail, success, getUpdatedAccessToken, DEFAULT_TYPE_CHECK } from "../../../../util/tools"
import { AdminPermissionLevel } from "../../../../../src/interface/admin"

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
      const response = {
        newAccessToken: "",
      }

      if (boardUid < 1) {
        return fail(`Invalid board uid.`, response)
      }
      if (userUid < 1) {
        return fail(`Invalid user uid.`, response)
      }
      const result = await changeBoardAdmin(boardUid, userUid)
      if (result === false) {
        return fail(`User not found.`, response)
      }
      return success({
        newAccessToken,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Number(),
        userUid: t.Number(),
      }),
    },
  )
  .patch(
    "/updatelevels",
    async ({ body: { boardUid, levels }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
      }

      if (boardUid < 1) {
        return fail(`Invalid board uid.`, response)
      }
      const levelKeys = Object.values(levels)
      for (const level of levelKeys) {
        if (level < 0 || level > 9) {
          return fail(`Invalid level. (0 ≤ level ≤ 9)`, response)
        }
      }
      updatePermissionLevels(boardUid, levels as AdminPermissionLevel)
      return success({
        newAccessToken,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
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
