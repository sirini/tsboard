/**
 * server/routers/auth/oauth
 *
 * 소셜 로그인 후 리다이렉션 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { registerUser, userSignIn } from "../../database/auth/signin"
import { saveTokens } from "../../database/auth/authorization"
import { Token } from "../../../src/interface/auth"
import { fail, success } from "../../util/tools"
import { INIT_USER } from "../../database/auth/const"
import { TSBOARD } from "../../../tsboard.config"

export const oauth = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/google",
    async ({ jwt, cookie: { refresh }, query: { code } }) => {
      const response = ""
      if (!process.env.OAUTH_GOOGLE_PW) {
        return fail(`Google OAuth informations are empty in .env`, response)
      }

      if (code.length < 1) {
        return fail(`Failed to get code from Google OAuth.`, response)
      }

      let userInfo: any = null
      try {
        const tokenResponse = await fetch(process.env.OAUTH_GOOGLE_TOKEN!, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            code,
            client_id: TSBOARD.OAUTH.GOOGLE.CLIENT_ID,
            client_secret: process.env.OAUTH_GOOGLE_PW,
            redirect_uri: TSBOARD.OAUTH.GOOGLE.REDIRECT_URI,
            grant_type: "authorization_code",
          }),
        })

        const googleToken = await tokenResponse.json()
        if (googleToken.access_token) {
          const userInfoResponse = await fetch(TSBOARD.OAUTH.GOOGLE.USERINFO_URI, {
            headers: {
              Authorization: `Bearer ${googleToken.access_token}`,
            },
          })

          userInfo = await userInfoResponse.json()

          console.table(userInfo) // DEBUG
        }
      } catch (e) {
        console.log(`[oauth/google] Failed to receive an access token from Google.`)
      }

      if (userInfo.email) {
        const userUid = await registerUser(userInfo.email, userInfo.name, userInfo.picture)
        const token: Token = {
          access: await jwt.sign({
            uid: userUid,
            id: userInfo.email,
            signin: Date.now() + TSBOARD.JWT.ACCESS_TIMEOUT * 1000 * 60,
          }),
          refresh: await jwt.sign({
            signin: Date.now() + TSBOARD.JWT.REFRESH_TIMEOUT * 1000 * 60 * 60 * 24,
          }),
        }
        saveTokens(userUid, token)

        refresh.set({
          value: token.refresh,
          maxAge: 86400 * 14,
          path: "/",
          httpOnly: TSBOARD.COOKIE.HTTP_ONLY,
          secure: TSBOARD.COOKIE.SECURE,
        })
      }
      return success(response)
    },
    {
      query: t.Object({
        code: t.String(),
      }),
    },
  )
