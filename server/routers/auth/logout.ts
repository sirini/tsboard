/**
 * server/routers/auth/logout
 *
 * 사용자 로그아웃 처리
 */
import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { clearUserToken } from "../../database/auth/logout"

export const logout = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .post(
    "/logout",
    async ({ jwt, body }) => {
      const access = await jwt.verify(body.token)
      if (access !== false) {
        clearUserToken(parseInt(access.uid.toString()))
      }
      return {
        success: true,
      }
    },
    {
      body: t.Object({
        token: t.String(),
      }),
    },
  )
