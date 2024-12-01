import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { checkUserVerification } from "../../database/auth/authorization"
import { checkPermission } from "../../database/board/common"
import {
  removeAttachedFile
} from "../../database/board/editor"
import { getUserLevel } from "../../database/board/list"
import {
  DEFAULT_TYPE_CHECK,
  fail,
  success
} from "../../util/tools"

export const removeAttachedRouter = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers: { authorization }, cookie: { refresh }, query: { userUid } }) => {
    let accessUserUid = 0
    let userLevel = 0
    let newAccessToken = ""

    const verification = await checkUserVerification({
      jwt,
      userUid: parseInt(userUid ?? "0"),
      accessToken: authorization ?? "",
      refreshToken: refresh.value ?? "",
    })

    if (verification.success === true) {
      accessUserUid = verification.accessUserUid
      userLevel = await getUserLevel(accessUserUid)
      newAccessToken = verification.newAccessToken
    }

    return {
      accessUserUid,
      userLevel,
      newAccessToken,
    }
  })
  .delete(
    "/remove/attached",
    async ({ query: { boardUid, postUid, fileUid }, accessUserUid }) => {
      let response = ""
      if (fileUid < 1) {
        return fail(`Invalid parameter.`, response)
      }
      const checked = await checkPermission({
        accessUserUid,
        boardUid,
        postUid,
        action: "write_post",
        target: "post",
      })
      if (checked.result === false) {
        return fail(checked.error, response)
      }
      removeAttachedFile(fileUid)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        boardUid: t.Numeric(),
        postUid: t.Numeric(),
        fileUid: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )