/**
 * server/routers/admin/user/modify
 *
 * 사용자 정보 수정과 관련된 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, getUpdatedAccessToken } from "../../../util/tools"
import { getUserInfo, modifyUserInfo } from "../../../database/admin/user/modify"
import { isDuplicatedName } from "../../../database/auth/signup"
import { INIT_USER } from "../../../database/auth/const"

const defaultTypeCheck = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
}

export const modify = new Elysia()
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
      const user = await getUserInfo(userUid)
      return success({
        newAccessToken,
        user,
      })
    },
    {
      ...defaultTypeCheck,
      query: t.Object({
        userUid: t.Numeric(),
      }),
    },
  )
  .patch(
    "/modify",
    async ({
      body: { userUid, name, level, point, signature, password, profile },
      newAccessToken,
    }) => {
      const response = {
        newAccessToken: "",
      }

      if (userUid < 1) {
        return fail(`Invalid user uid.`, response)
      }
      if (name.length < 2) {
        return fail(`Name is too short.`, response)
      }
      if (level < 0 || point < 0) {
        return fail(`Minus value is not allowed.`, response)
      }
      if ((await isDuplicatedName(userUid, name)) === true) {
        return fail(`Duplicated name.`, response)
      }
      await modifyUserInfo({
        userUid,
        name,
        level,
        point,
        signature,
        password,
        profile,
      })
      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        userUid: t.Numeric(),
        name: t.String(),
        level: t.Numeric(),
        point: t.Numeric(),
        signature: t.String(),
        password: t.String(),
        profile: t.Optional(
          t.File({
            type: "image",
            error: "Invalid profile image.",
          }),
        ),
      }),
    },
  )
