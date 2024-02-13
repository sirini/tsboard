/**
 * server/routers/auth/myinfo
 *
 * 내 정보 수정하기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { isDuplicatedName } from "../../database/auth/signup"
import { fail, success, updateAccessToken } from "../../util/tools"
import { getUser } from "../../database/auth/myinfo"
import { getUserInfo, modifyUserInfo } from "../../database/admin/user/modify"

const defaultTypeCheck = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
}

export const myInfo = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/load",
    async ({ jwt, cookie: { refresh }, headers, query: { userUid } }) => {
      if (userUid < 1) {
        return fail(`Invalid user uid.`)
      }
      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      const user = await getUser(userUid)
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
    "/update",
    async ({ jwt, cookie: { refresh }, headers, body: { name, password, signature, profile } }) => {
      if (name.length < 2) {
        return fail(`Name is too short.`)
      }
      const access = await jwt.verify(headers.authorization ?? "")
      if (access === false) {
        return fail(`Invalid authorization, please login in again.`)
      }
      const userUid = access.uid as number
      if ((await isDuplicatedName(userUid, name)) === true) {
        return fail(`Duplicated name.`)
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
      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
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
