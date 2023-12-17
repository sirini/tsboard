/**
 * server/routers/auth/sign-in
 *
 * 사용자 로그인 처리
 */
import { Elysia, t } from "elysia"
import { cookie } from "@elysiajs/cookie"
import { jwt } from "@elysiajs/jwt"
import { userSignIn, saveTokens } from "../../database/auth/sign-in"
import { Token } from "../../interface/auth"

export const signIn = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY ?? "!!_please_%_update_@_env_!!",
    }),
  )
  .use(cookie())
  .post(
    "/sign-in",
    async ({ jwt, cookie, setCookie, body }) => {
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
          signin: user.signin,
        }),
        refresh: await jwt.sign({
          signin: user.signin,
        }),
      }

      setCookie("refresh", token.refresh, {
        httpOnly: true,
        maxAge: 86400,
      })

      saveTokens(user.uid, token)

      return {
        success: true,
        ...user,
        token: token.access,
      }
    },
    {
      body: t.Object({
        id: t.String(),
        password: t.String(),
      }),
    },
  )
