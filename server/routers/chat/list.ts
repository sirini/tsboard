import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { ChatItem } from "../../../src/interface/user"
import { checkUserVerification } from "../../database/auth/authorization"
import { getChatList } from "../../database/user/chat"
import { DEFAULT_TYPE_CHECK, fail, success } from "../../util/tools"

export const listRouter = new Elysia()
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
    "/list",
    async ({ query: { limit }, accessUserUid }) => {
      let response: ChatItem[] = []
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }
      const list = await getChatList(accessUserUid, limit)
      return success(list)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        limit: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )