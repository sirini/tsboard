import { jwt } from "@elysiajs/jwt"
import { Elysia } from "elysia"
import { checkUserVerification } from "../../database/auth/authorization"
import { checkedAllNotifications } from "../../database/home/notification"
import { EXTEND_TYPE_CHECK, fail, success } from "../../util/tools"

export const notiCheckedRouter = new Elysia()
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
  .patch(
    "/checked",
    async ({ accessUserUid }) => {
      const response = ""
      if (accessUserUid < 1) {
        return fail(`Invalid parameter.`, response)
      }

      checkedAllNotifications(accessUserUid)
      return success(response)
    },
    EXTEND_TYPE_CHECK,
  )
