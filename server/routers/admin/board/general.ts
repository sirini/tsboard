/**
 * server/routers/admin/board/general
 *
 * 게시판 관리화면 > 일반 부분 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { Token } from "../../../../src/interface/auth"
import { saveTokens } from "../../../database/auth/authorization"
import { getBoardConfig } from "../../../database/admin/board/general"
import { fail, success } from "../../../util/tools"

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
      async ({ jwt, cookie: { refresh }, headers, query: { id } }) => {
        const access = await jwt.verify(headers.authorization)
        if (access === false) {
          return fail(`Invalid authorization.`)
        }
        const userUid = access.uid as number
        const accessTokenTime = access.signin as number
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

        const config = await getBoardConfig(id)
        if (config.uid < 1) {
          return fail(`Invalid id.`)
        }

        return success({
          config,
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
        query: t.Object({
          id: t.String(),
        }),
      },
    )
  })
