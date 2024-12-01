import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { checkUserVerification } from "../../database/auth/authorization"
import { isAuthor } from "../../database/board/editor"
import { getUserLevel } from "../../database/board/list"
import {
  removePost
} from "../../database/board/view"
import { haveAdminPermission } from "../../database/user/manageuser"
import { DEFAULT_TYPE_CHECK, fail, success } from "../../util/tools"

export const removePostRouter = new Elysia()
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
    "/remove/post",
    async ({ query: { boardUid, postUid }, accessUserUid, newAccessToken }) => {
      let response = {
        newAccessToken,
      }
      if (postUid < 1) {
        return fail(`Invalid parameter.`, response)
      }
      const isAdmin = await haveAdminPermission(accessUserUid, boardUid)
      const isWriter = await isAuthor(postUid, accessUserUid, "post")
      if (isAdmin === false && isWriter === false) {
        return fail(`You are neither the author nor the administrator.`, response)
      }

      removePost(postUid)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        boardUid: t.Numeric(),
        postUid: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )