/**
 * server/routers/auth/oauth
 *
 * 소셜 로그인 후 리다이렉션 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { registerUser } from "../../database/auth/signin"
import { saveTokens } from "../../database/auth/authorization"
import { Token, User } from "../../../src/interface/auth"
import { AUTH, OAUTH } from "../../../tsboard.config"
import { getUser } from "../../database/auth/myinfo"
import { INIT_USER } from "../../database/auth/const"
import { fail, success } from "../../util/tools"

export const oauth = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/google",
    async ({ jwt, cookie: { refresh, googleUserInfo }, query: { code }, set }) => {
      set.headers["Content-Type"] = "text/html"

      if (!process.env.OAUTH_GOOGLE_PW) {
        return "<!DOCTYPE html><html><head><title>TSBOARD</title></head><body><h1>Failed to access Google OAuth</h1><p><button onclick='window.close()'>CLOSE</button></p></body></html>"
      }

      if (code.length < 1) {
        return "<!DOCTYPE html><html><head><title>TSBOARD</title></head><body><h1>Failed to get a code from Google</h1><p><button onclick='window.close()'>CLOSE</button></p></body></html>"
      }

      let userInfo: any = null
      const tokenResponse = await fetch(OAUTH.GOOGLE.TOKEN_URI, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: OAUTH.GOOGLE.CLIENT_ID,
          client_secret: process.env.OAUTH_GOOGLE_PW,
          redirect_uri: OAUTH.GOOGLE.REDIRECT_URI,
          grant_type: "authorization_code",
        }),
      })

      const googleToken = await tokenResponse.json()
      if (googleToken.access_token) {
        const userInfoResponse = await fetch(OAUTH.GOOGLE.USERINFO_URI, {
          headers: {
            Authorization: `Bearer ${googleToken.access_token}`,
          },
        })
        userInfo = await userInfoResponse.json()
      }

      if (userInfo === null) {
        return "<!DOCTYPE html><html><head><title>TSBOARD</title></head><body><h1>Unable to get an user information from Google</h1><p><button onclick='window.close()'>CLOSE</button></p></body></html>"
      }

      if (userInfo.email) {
        const userUid = await registerUser(userInfo.email, userInfo.name, userInfo.picture)
        const token: Token = {
          access: await jwt.sign({
            uid: userUid,
            id: userInfo.email,
            signin: Date.now() + AUTH.JWT.ACCESS_TIMEOUT * 1000 * 60,
          }),
          refresh: await jwt.sign({
            signin: Date.now() + AUTH.JWT.REFRESH_TIMEOUT * 1000 * 60 * 60 * 24,
          }),
        }
        saveTokens(userUid, token)

        refresh.set({
          value: token.refresh,
          maxAge: 86400 * 14,
          path: "/",
          httpOnly: AUTH.COOKIE.HTTP_ONLY,
          secure: AUTH.COOKIE.SECURE,
        })

        const googleUser = await getUser(userUid)
        googleUserInfo.set({
          value: JSON.stringify(googleUser),
          maxAge: 600000,
          path: "/",
          httpOnly: AUTH.COOKIE.HTTP_ONLY,
          secure: AUTH.COOKIE.SECURE,
        })
      }
      return `<!DOCTYPE html><html><head><script type='text/javascript'>window.opener.postMessage('${OAUTH.SUCCESS_MESSAGE}', '*');window.onload=function(){window.close();};</script><title>TSBOARD</title></head><body><h1>Login Successful</h1><p><button onclick='window.close()'>CLOSE</button></p></body></html>`
    },
    {
      query: t.Object({
        code: t.String(),
      }),
    },
  )
  .get("/google/userinfo", async ({ cookie: { googleUserInfo } }) => {
    let response = INIT_USER
    if (googleUserInfo.value.length < 1) {
      return fail(`User information from Google is not available.`, response)
    }
    return success(googleUserInfo.value)
  })
