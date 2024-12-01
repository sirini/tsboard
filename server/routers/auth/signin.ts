/**
 * server/routers/auth/signin
 *
 * 사용자 로그인 처리
 */

import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { AUTH } from "../../../tsboard.config"
import { saveTokens } from "../../database/auth/authorization"
import { INIT_USER } from "../../database/auth/const"
import { userSignIn } from "../../database/auth/signin"
import { fail, success } from "../../util/tools"

export const signInRouter = new Elysia()
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

      const now = Math.floor(Date.now() / 1000)
      user.token = await jwt.sign({
        uid: user.uid,
        exp: now + AUTH.JWT.ACCESS_TIMEOUT * 60,
      })

      const refreshToken = await jwt.sign({
        exp: now + AUTH.JWT.REFRESH_TIMEOUT * 60 * 60 * 24,
      })
      user.admin = user.uid === 1 ? true : false

      saveTokens(user.uid, refreshToken)

      refresh.set({
        value: refreshToken,
        maxAge: 86400 * AUTH.JWT.REFRESH_TIMEOUT,
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
