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
    async ({ jwt, cookie: { refresh }, headers }) => {
      const access = await jwt.verify(headers.authorization)
      if (access !== false) {
        clearUserToken(parseInt(access.uid.toString()))
      }
      refresh.remove()

      return {
        success: true,
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
    },
  )
