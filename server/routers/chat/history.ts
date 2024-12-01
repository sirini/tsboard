import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { ChatHistory } from "../../../src/interface/user"
import { checkUserVerification } from "../../database/auth/authorization"
import { getChatHistory } from "../../database/user/chat"
import { DEFAULT_TYPE_CHECK, fail, success } from "../../util/tools"

export const historyRouter = new Elysia()
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
    "/history",
    async ({ query: { userUid, limit }, accessUserUid }) => {
      let response: ChatHistory[] = []
      if (userUid < 1 || accessUserUid < 1) {
        return fail(`Invalid parameters.`, response)
      }

      response = await getChatHistory(accessUserUid, userUid, limit)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        userUid: t.Numeric(),
        limit: t.Numeric(),
      }),
    },
  )
