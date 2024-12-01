import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { checkUserVerification } from "../../database/auth/authorization"
import { havePermission } from "../../database/board/common"
import { isBannedByOther, saveNewChat } from "../../database/user/chat"
import { EXTEND_TYPE_CHECK, fail, success } from "../../util/tools"

export const saveRouter = new Elysia()
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
  .post(
    "/save",
    async ({ body: { targetUserUid, message }, accessUserUid }) => {
      let response = 0

      if (accessUserUid < 1 || targetUserUid < 1 || message.length < 1) {
        return fail(`Invalid parameters.`, response)
      }
      if ((await isBannedByOther(accessUserUid, targetUserUid)) === true) {
        return fail(`You have been blocked.`, response)
      }
      if ((await havePermission(accessUserUid, "send_chat")) === false) {
        return fail(`You have no permission.`, response)
      }

      message = Bun.escapeHTML(message)
      response = await saveNewChat(accessUserUid, targetUserUid, message)
      return success(response)
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        message: t.String(),
        targetUserUid: t.Numeric(),
      }),
    },
  )
