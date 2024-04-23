/**
 * server/routers/admin/user/modify
 *
 * 사용자 정보 수정과 관련된 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, DEFAULT_TYPE_CHECK, EXTEND_TYPE_CHECK } from "../../../util/tools"
import { getUserInfo, modifyUserInfo } from "../../../database/admin/user/modify"
import { isDuplicatedName } from "../../../database/auth/signup"
import { INIT_USER } from "../../../database/auth/const"
import { checkUserVerification } from "../../../database/auth/authorization"
import { haveAdminPermission } from "../../../database/user/manageuser"
import { NO_TABLE_TARGET } from "../../../database/user/const"

export const modify = new Elysia()
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
      refreshToken: refresh.value,
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
  .get(
    "/load",
    async ({ query: { userUid }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken: "",
        user: INIT_USER,
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
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
      ...DEFAULT_TYPE_CHECK,
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
      accessUserUid,
    }) => {
      const response = {
        newAccessToken: "",
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
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
      ...EXTEND_TYPE_CHECK,
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
