/**
 * server/routers/auth/logout
 *
 * 사용자 로그아웃 처리
 */
import { jwt } from "@elysiajs/jwt"
import { Elysia } from "elysia"
import { clearUserToken } from "../../database/auth/logout"
import { DEFAULT_TYPE_CHECK, success } from "../../util/tools"

export const logoutRouter = new Elysia()
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
        clearUserToken(access.uid as number)
      }
      if (refresh.value) {
        refresh.remove()
      }

      return success("")
    },
    {
      ...DEFAULT_TYPE_CHECK,
    },
  )
