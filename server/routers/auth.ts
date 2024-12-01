/**
 * server/routers/auth
 *
 * 사용자 로그인 및 인증 관련 처리
 */

import { Elysia } from "elysia"
import { checkEmailName } from "./auth/checkemailname"
import { loadUserInfo } from "./auth/load"
import { logout } from "./auth/logout"
import { oauth } from "./auth/oauth"
import { resetPassword } from "./auth/resetpassword"
import { signIn } from "./auth/signin"
import { signUp } from "./auth/signup"
import { updateUserInfo } from "./auth/update"
import { verifyCode } from "./auth/verify"

export const auth = new Elysia().group("/auth", (app) => {
  return app.use(signIn)
    .use(signUp)
    .use(resetPassword)
    .use(checkEmailName)
    .use(verifyCode)
    .use(loadUserInfo)
    .use(updateUserInfo)
    .use(logout)
    .use(oauth)
})
