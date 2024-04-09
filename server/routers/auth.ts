/**
 * server/routers/auth
 *
 * 사용자 로그인 및 인증 관련 처리
 */

import { Elysia } from "elysia"
import { signIn } from "./auth/signin"
import { signUp } from "./auth/signup"
import { logout } from "./auth/logout"
import { resetPassword } from "./auth/resetpassword"
import { myInfo } from "./auth/myinfo"
import { oauth } from "./auth/oauth"

export const auth = new Elysia().group("/auth", (app) => {
  return app.use(signIn).use(signUp).use(logout).use(resetPassword).use(myInfo).use(oauth)
})
