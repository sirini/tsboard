/**
 * server/routers/auth/signin
 *
 * 사용자 로그인 처리
 */
import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { cookie } from "@elysiajs/cookie"
import { userSignIn, saveTokens } from "../../database/auth/signin"
import { Token } from "../../../src/interface/auth"

export const signIn = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .use(cookie())
  .post(
    "/signin",
    async ({ jwt, setCookie, body }) => {
      const id = body.id.trim()
      const password = body.password.trim()
      if (id.length < 4 || password.length !== 64) {
        return {
          success: false,
          error: `Invalid id or password`,
          body,
        }
      }
      const user = await userSignIn(id, password)
      if (user.uid < 1) {
        return {
          success: false,
          error: `Unable to get an user information`,
          body,
        }
      }

      const token: Token = {
        access: await jwt.sign({
          uid: user.uid,
          id: user.id,
          signin: user.signin,
        }),
        refresh: await jwt.sign({
          signin: user.signin,
        }),
      }
      user.token = token.access
      user.admin = user.uid === 1 ? true : false

      setCookie("refresh", token.refresh, {
        httpOnly: true,
        maxAge: 86400 * 14,
      })

      saveTokens(user.uid, token)

      return {
        success: true,
        user,
      }
    },
    {
      body: t.Object({
        id: t.String(),
        password: t.String(),
      }),
    },
  )
