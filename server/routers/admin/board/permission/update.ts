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
import { fail, success, EXTEND_TYPE_CHECK } from "../../../../util/tools"
import { AdminPermissionLevel } from "../../../../../src/interface/admin"
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
  .resolve(async ({ jwt, headers: { authorization }, cookie: { refresh }, query: { userUid } }) => {
    let accessUserUid = 0
    let newAccessToken = ""

    const verification = await checkUserVerification({
      jwt,
      userUid: parseInt(userUid ?? "0"),
      accessToken: authorization ?? "",
      refreshToken: refresh.value ?? "",
    })

    if (
      verification.success === true &&
      (await haveAdminPermission(verification.accessUserUid, NO_TABLE_TARGET)) === true
    ) {
      accessUserUid = verification.accessUserUid
      newAccessToken = verification.newAccessToken
    }

    return {
      accessUserUid,
      newAccessToken,
    }
  })
  .patch(
    "/change/admin",
    async ({ body: { boardUid, targetUserUid }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken: "",
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
      }
      if (boardUid < 1) {
        return fail(`Invalid board uid.`, response)
      }
      if (targetUserUid < 1) {
        return fail(`Invalid user uid.`, response)
      }
      const result = await changeBoardAdmin(boardUid, targetUserUid)
      if (result === false) {
        return fail(`User not found.`, response)
      }
      return success({
        newAccessToken,
      })
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Number(),
        targetUserUid: t.Number(),
      }),
    },
  )
  .patch(
    "/update/levels",
    async ({ body: { boardUid, levels }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken,
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
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
      ...EXTEND_TYPE_CHECK,
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
