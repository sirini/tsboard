/**
 * server/routers/auth/myinfo
 *
 * 내 정보 수정하기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { isDuplicatedName } from "../../database/auth/signup"
import { fail, success, getUpdatedAccessToken, DEFAULT_TYPE_CHECK } from "../../util/tools"
import { getUser } from "../../database/auth/myinfo"
import { getUserInfo, modifyUserInfo } from "../../database/admin/user/modify"
import { INIT_USER } from "../../database/auth/const"

export const myInfo = new Elysia()
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
  .get(
    "/load",
    async ({ query: { userUid }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
        user: INIT_USER,
      }

      if (userUid < 1) {
        return fail(`Invalid user uid.`, response)
      }
      const user = await getUser(userUid)
      return success({
        newAccessToken,
        user,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        userUid: t.Numeric(),
      }),
    },
  )
  .patch(
    "/update",
    async ({ body: { name, password, signature, profile }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken: "",
      }

      if (name.length < 2) {
        return fail(`Name is too short.`, response)
      }
      if (accessUserUid < 1) {
        return fail(`Invalid authorization, please login in again.`, response)
      }
      const userUid = accessUserUid
      if ((await isDuplicatedName(userUid, name)) === true) {
        return fail(`Duplicated name.`, response)
      }
      const user = await getUserInfo(userUid)
      await modifyUserInfo({
        userUid,
        name,
        level: user.level,
        point: user.point,
        signature,
        password,
        profile,
      })

      return success({
        newAccessToken,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        name: t.String(),
        password: t.String(),
        signature: t.String(),
        profile: t.Optional(
          t.File({
            type: "image",
            error: "Invalid profile image.",
          }),
        ),
      }),
    },
  )
