/**
 * server/routers/auth/myinfo
 *
 * 내 정보 수정하기 처리
 */

import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { getUserInfo, modifyUserInfo } from "../../database/admin/user/modify"
import { checkUserVerification } from "../../database/auth/authorization"
import { isDuplicatedName } from "../../database/auth/signup"
import { EXTEND_TYPE_CHECK, fail, success } from "../../util/tools"

export const updateUserInfo = new Elysia()
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

    if (verification.success === true) {
      accessUserUid = verification.accessUserUid
      newAccessToken = verification.newAccessToken
    }

    return {
      accessUserUid,
      newAccessToken,
    }
  })
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
        return fail(`Unauthorized access.`, response)
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
      ...EXTEND_TYPE_CHECK,
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
