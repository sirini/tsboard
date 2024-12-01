import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { checkUserVerification } from "../../database/auth/authorization"
import { INIT_USER } from "../../database/auth/const"
import { getUser } from "../../database/auth/myinfo"
import { DEFAULT_TYPE_CHECK, fail, success } from "../../util/tools"

export const loadUserInfoRouter = new Elysia()
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
  .get(
    "/load",
    async ({ query: { userUid }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken,
        user: INIT_USER,
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
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