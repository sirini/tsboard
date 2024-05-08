/**
 * server/routers/auth/oauth
 *
 * 소셜 로그인 후 리다이렉션 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { registerUser } from "../../database/auth/signin"
import { saveTokens } from "../../database/auth/authorization"
import { AUTH, OAUTH, TSBOARD } from "../../../tsboard.config"
import { getUser } from "../../database/auth/myinfo"
import { INIT_USER } from "../../database/auth/const"
import { fail, success } from "../../util/tools"
import { nanoid } from "nanoid"

export const oauth = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get("/google/request", async ({ set }) => {
    const scope = "email profile"
    const redirectURI = `${TSBOARD.API.URI}/tsapi/auth/google/callback`
    const requestURI = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.OAUTH_GOOGLE_CLIENT_ID}&redirect_uri=${redirectURI}&scope=${scope}&response_type=code&access_type=offline&prompt=select_account`
    set.redirect = requestURI
    return
  })
  .get(
    "/google/callback",
    async ({ jwt, cookie: { refresh, oauthUserInfo }, query: { code }, set }) => {
      set.headers["Content-Type"] = "text/html"

      if (!process.env.OAUTH_GOOGLE_PW) {
        set.redirect = TSBOARD.API.URI
        return
      }

      if (code.length < 1) {
        set.redirect = TSBOARD.API.URI
        return
      }

      let userInfo: any = null
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.OAUTH_GOOGLE_CLIENT_ID || "",
          client_secret: process.env.OAUTH_GOOGLE_PW || "",
          redirect_uri: `${TSBOARD.API.URI}/tsapi/auth/google/callback`,
          grant_type: "authorization_code",
        }),
      })

      const googleToken = await tokenResponse.json()
      if (googleToken.access_token) {
        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: {
            Authorization: `Bearer ${googleToken.access_token}`,
          },
        })
        userInfo = await userInfoResponse.json()
      }

      if (userInfo === null) {
        set.redirect = TSBOARD.API.URI
        return
      }

      if (userInfo.email) {
        const userUid = await registerUser(userInfo.email, userInfo.name, userInfo.picture)
        const now = Math.floor(Date.now() / 1000)
        const accessToken = await jwt.sign({
          uid: userUid,
          exp: now + AUTH.JWT.ACCESS_TIMEOUT * 60,
        })
        const refreshToken = await jwt.sign({
          exp: now + AUTH.JWT.REFRESH_TIMEOUT * 60 * 60 * 24,
        })

        saveTokens(userUid, refreshToken)

        refresh.set({
          value: refreshToken,
          maxAge: AUTH.JWT.REFRESH_TIMEOUT * 86400,
          path: "/",
          httpOnly: AUTH.COOKIE.HTTP_ONLY,
          secure: AUTH.COOKIE.SECURE,
        })

        const googleUser = await getUser(userUid)
        googleUser.token = accessToken

        oauthUserInfo.set({
          value: JSON.stringify(googleUser),
          maxAge: AUTH.JWT.OAUTH_TIMEOUT * 60,
          path: "/",
          httpOnly: AUTH.COOKIE.HTTP_ONLY,
          secure: AUTH.COOKIE.SECURE,
        })
      }

      set.redirect = `${TSBOARD.API.URI}/login/oauth`
      return
    },
    {
      query: t.Object({
        code: t.String(),
      }),
    },
  )

  .get("/naver/request", async ({ set }) => {
    const redirectURI = `${TSBOARD.API.URI}/tsapi/auth/naver/callback`
    const requestURI = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.OAUTH_NAVER_CLIENT_ID}&redirect_uri=${redirectURI}&state=${nanoid()}`
    set.redirect = requestURI
    return
  })
  .get(
    "/naver/callback",
    async ({ jwt, cookie: { refresh, oauthUserInfo }, query: { code, state }, set }) => {
      if (!process.env.OAUTH_NAVER_PW) {
        set.redirect = TSBOARD.API.URI
        return
      }

      if (code.length < 1) {
        set.redirect = TSBOARD.API.URI
        return
      }

      let userInfo: any = null
      const tokenResponse = await fetch("https://nid.naver.com/oauth2.0/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Naver-Client-Id": process.env.OAUTH_NAVER_CLIENT_ID || "",
          "X-Naver-Client-Secret": process.env.OAUTH_NAVER_PW || "",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.OAUTH_NAVER_CLIENT_ID || "",
          client_secret: process.env.OAUTH_NAVER_PW || "",
          redirect_uri: `${TSBOARD.API.URI}/tsapi/naver/callback`,
          code,
          state,
        }),
      })

      const naverToken = await tokenResponse.json()
      if (naverToken.access_token) {
        const userInfoResponse = await fetch("https://openapi.naver.com/v1/nid/me", {
          headers: {
            Authorization: `Bearer ${naverToken.access_token}`,
          },
        })
        userInfo = await userInfoResponse.json()
      }

      if (userInfo === null) {
        set.redirect = TSBOARD.API.URI
        return
      }

      userInfo = userInfo.response

      if (userInfo.email) {
        const userUid = await registerUser(
          userInfo.email,
          userInfo.nickname,
          userInfo.profile_image,
        )
        const now = Math.floor(Date.now() / 1000)
        const accessToken = await jwt.sign({
          uid: userUid,
          exp: now + AUTH.JWT.ACCESS_TIMEOUT * 60,
        })
        const refreshToken = await jwt.sign({
          exp: now + AUTH.JWT.REFRESH_TIMEOUT * 60 * 60 * 24,
        })

        saveTokens(userUid, refreshToken)

        refresh.set({
          value: refreshToken,
          maxAge: AUTH.JWT.REFRESH_TIMEOUT * 86400,
          path: "/",
          httpOnly: AUTH.COOKIE.HTTP_ONLY,
          secure: AUTH.COOKIE.SECURE,
        })

        const naverUser = await getUser(userUid)
        naverUser.token = accessToken

        oauthUserInfo.set({
          value: JSON.stringify(naverUser),
          maxAge: AUTH.JWT.OAUTH_TIMEOUT * 60,
          path: "/",
          httpOnly: AUTH.COOKIE.HTTP_ONLY,
          secure: AUTH.COOKIE.SECURE,
        })
      }

      set.redirect = `${TSBOARD.API.URI}/login/oauth`
      return
    },
    {
      query: t.Object({
        code: t.String(),
        state: t.String(),
      }),
    },
  )
  .get("/oauth/userinfo", async ({ cookie: { oauthUserInfo } }) => {
    let response = INIT_USER
    if (oauthUserInfo.value.length < 1) {
      return fail(`User information from Google is not available.`, response)
    }
    return success(oauthUserInfo.value)
  })
