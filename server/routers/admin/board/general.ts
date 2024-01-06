/**
 * server/routers/admin/board/general
 *
 * 게시판 관리화면 > 일반 부분 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { Token } from "../../../../src/interface/auth"
import { saveTokens } from "../../../database/auth/authorization"
import { fail, success, number } from "../../../util/tools"

export const general = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .group("/general", (app) => {
    return app.get(
      "/load",
      async ({ jwt, cookie: { refresh }, headers }) => {
        /** TODO 코드 중복 발생 요소들 정리 방안 마련하기 */
        const access = await jwt.verify(headers.authorization)
        if (access === false) {
          return fail(`Invalid authorization.`)
        }
        const userUid = number(access.uid)
        const accessTokenTime = number(access.signin)
        const now = Date.now()
        let updateAccessToken = ""

        if (accessTokenTime < now) {
          updateAccessToken = await jwt.sign({
            uid: userUid,
            id: access.id,
            signin: Date.now(),
          })
          const token: Token = {
            access: updateAccessToken,
            refresh: refresh.value,
          }
          saveTokens(userUid, token)
        }

        /** TODO 게시판 일반 설정 항목 가져와서 반환하기 */
        return success({
          updateAccessToken,
        })
      },
      {
        headers: t.Object({
          authorization: t.String(),
        }),
        cookie: t.Cookie({
          refresh: t.String(),
        }),
      },
    )
  })
