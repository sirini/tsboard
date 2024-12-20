import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { checkUserVerification } from "../../database/auth/authorization"
import { NO_TABLE_TARGET } from "../../database/user/const"
import {
  haveAdminPermission,
  updateUserPermission
} from "../../database/user/manageuser"
import { EXTEND_TYPE_CHECK, fail, success } from "../../util/tools"

export const manageUserRouter = new Elysia()
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

    if ((await haveAdminPermission(accessUserUid, NO_TABLE_TARGET)) === false) {
      return {
        accessUserUid,
        newAccessToken,
      }
    }

    return {
      accessUserUid,
      newAccessToken,
    }
  })
  .post(
    "/manage/user",
    async ({
      body: { userUid, writePost, writeComment, sendChatMessage, sendReport, login, response },
      accessUserUid,
      newAccessToken,
    }) => {
      const res = {
        newAccessToken: "",
      }
      if (userUid < 1) {
        return fail(`Invalid target user.`, res)
      }
      if (response.length < 3) {
        return fail(`Invalid content.`, res)
      }
      await updateUserPermission(
        {
          writePost,
          writeComment,
          sendChatMessage,
          sendReport,
          login,
          userUid,
          response,
        },
        accessUserUid,
      )
      return success({
        newAccessToken,
      })
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        userUid: t.Number(),
        writePost: t.Boolean(),
        writeComment: t.Boolean(),
        sendChatMessage: t.Boolean(),
        sendReport: t.Boolean(),
        login: t.Boolean(),
        response: t.String(),
      }),
    },
  )
