import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { checkUserVerification } from "../../database/auth/authorization"
import { getUserLevel } from "../../database/board/list"
import {
  likePost
} from "../../database/board/view"
import { EXTEND_TYPE_CHECK, fail, success } from "../../util/tools"

export const likeRouter = new Elysia()
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
  .patch(
    "/like",
    async ({ body: { boardUid, postUid, liked }, accessUserUid }) => {
      const response = ""
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }
      likePost({
        boardUid,
        postUid,
        accessUserUid,
        liked,
      })
      return success(response)
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        postUid: t.Numeric(),
        liked: t.Numeric(),
      }),
    },
  )