/**
 * server/routers/auth/sign-in
 *
 * 사용자 로그인 처리
 */
import { Elysia, t } from "elysia"

export const signIn = new Elysia().post(
  "/sign-in",
  ({ body }) => {
    return {
      success: false,
      error: `Invalid user info.`,
      ...body,
    }
  },
  {
    body: t.Object({
      id: t.String(),
      password: t.String(),
    }),
  },
)
