/**
 * server/routers/board/comment
 *
 * 댓글 관련 라우팅 처리
 */

import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { checkUserVerification } from "../../database/auth/authorization"
import {
  likeComment
} from "../../database/board/comment"
import { getUserLevel } from "../../database/board/list"
import {
  EXTEND_TYPE_CHECK,
  fail,
  success
} from "../../util/tools"

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
    async ({ body: { boardUid, commentUid, liked }, accessUserUid }) => {
      const response = ""

      if (boardUid < 1 || commentUid < 1 || liked > 1 || liked < 0) {
        return fail(`Invalid parameters.`, response)
      }
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }
      likeComment({
        boardUid,
        commentUid,
        accessUserUid,
        liked,
      })
      return success(response)
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        commentUid: t.Numeric(),
        liked: t.Numeric(),
      }),
    },
  )