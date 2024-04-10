/**
 * server/routers/auth/signin
 *
 * 사용자 로그인 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { userSignIn } from "../../database/auth/signin"
import { saveTokens } from "../../database/auth/authorization"
import { Token } from "../../../src/interface/auth"
import { fail, success } from "../../util/tools"
import { INIT_USER } from "../../database/auth/const"
import { AUTH } from "../../../tsboard.config"

export const signIn = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .post(
    "/signin",
    async ({ jwt, cookie: { refresh }, body: { id, password } }) => {
      const response = {
        user: INIT_USER,
      }
      if (id.length < 4 || password.length !== 64) {
        return fail(`Invalid id or password`, response)
      }
      const user = await userSignIn(id, password)
      if (user.uid < 1) {
        return fail(`Unable to get an user information`, response)
      }

      // 토큰 만료 시간까지 추가해서 입력
      const token: Token = {
        access: await jwt.sign({
          uid: user.uid,
          id: user.id,
          signin: user.signin + AUTH.JWT.ACCESS_TIMEOUT * 1000 * 60,
        }),
        refresh: await jwt.sign({
          signin: user.signin + AUTH.JWT.REFRESH_TIMEOUT * 1000 * 60 * 60 * 24,
        }),
      }
      user.token = token.access
      user.admin = user.uid === 1 ? true : false

      saveTokens(user.uid, token)

      refresh.set({
        value: token.refresh,
        maxAge: 86400 * 14,
        path: "/",
        httpOnly: AUTH.COOKIE.HTTP_ONLY,
        secure: AUTH.COOKIE.SECURE,
      })

      return success({ user })
    },
    {
      body: t.Object({
        id: t.String(),
        password: t.String(),
      }),
    },
  )
