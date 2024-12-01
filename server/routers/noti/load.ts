import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { TsboardNotification } from "../../../src/interface/home"
import { checkUserVerification } from "../../database/auth/authorization"
import { getNotifications } from "../../database/home/notification"
import { DEFAULT_TYPE_CHECK, fail, success } from "../../util/tools"

export const notiLoadRouter = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers: { authorization }, cookie: { refresh }, query: { userUid } }) => {
    let accessUserUid = 0

    const verification = await checkUserVerification({
      jwt,
      userUid: parseInt(userUid ?? "0"),
      accessToken: authorization ?? "",
      refreshToken: refresh.value ?? "",
    })

    if (verification.success === true) {
      accessUserUid = verification.accessUserUid
    }

    return {
      accessUserUid,
    }
  })
  .get(
    "/load",
    async ({ accessUserUid, query: { limit } }) => {
      let response = [] as TsboardNotification[]
      if (accessUserUid < 1 || limit < 1) {
        return fail(`Invalid parameters.`, response)
      }

      response = await getNotifications(accessUserUid, limit)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        limit: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )