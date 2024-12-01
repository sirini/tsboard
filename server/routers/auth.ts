import { Elysia } from "elysia"
import { checkEmailNameRouter } from "./auth/checkemailname"
import { loadUserInfoRouter } from "./auth/load"
import { logoutRouter } from "./auth/logout"
import { oauthRouter } from "./auth/oauth"
import { resetPasswordRouter } from "./auth/resetpassword"
import { signInRouter } from "./auth/signin"
import { signUpRouter } from "./auth/signup"
import { updateUserInfoRouter } from "./auth/update"
import { verifyCodeRouter } from "./auth/verify"

export const auth = new Elysia().group("/auth", (app) => {
  return app.use(signInRouter)
    .use(signUpRouter)
    .use(resetPasswordRouter)
    .use(checkEmailNameRouter)
    .use(verifyCodeRouter)
    .use(loadUserInfoRouter)
    .use(updateUserInfoRouter)
    .use(logoutRouter)
    .use(oauthRouter)
})
