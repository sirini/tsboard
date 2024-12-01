/**
 * server/routers/auth/oauth
 *
 * 소셜 로그인 후 리다이렉션 처리
 */

import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { nanoid } from "nanoid"
import { TSBOARD } from "../../../tsboard.config"
import { saveTokens } from "../../database/auth/authorization"
import { INIT_USER } from "../../database/auth/const"
import { getUser } from "../../database/auth/myinfo"
import {
  generateAccessRefreshToken,
  requestAccessToken,
  requestUserInfo,
  saveTokenInCookie,
} from "../../database/auth/oauth"
import { registerUser } from "../../database/auth/signin"
import { fail, success } from "../../util/tools"

export const oauthRouter = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get("/google/request", async ({ redirect }) => {
    const scope = "email profile"
    const redirectURI = `${TSBOARD.API.URI}/tsapi/auth/google/callback`
    const requestURI = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.OAUTH_GOOGLE_CLIENT_ID}&redirect_uri=${redirectURI}&scope=${scope}&response_type=code&access_type=offline&prompt=select_account`
    return redirect(requestURI)
  })
  .get(
    "/google/callback",
    async ({ jwt, cookie: { refresh, oauthUserInfo }, query: { code }, redirect }) => {
      if (!process.env.OAUTH_GOOGLE_SECRET) {
        return redirect(TSBOARD.API.URI)
      }

      if (code.length < 1) {
        return redirect(TSBOARD.API.URI)
      }

      const googleToken = await requestAccessToken("google", code)
      let userInfo = await requestUserInfo("google", googleToken.access_token)
      if (userInfo === null) {
        return redirect(TSBOARD.API.URI)
      }

      if (userInfo.email) {
        const userUid = await registerUser(userInfo.email, userInfo.name, userInfo.picture)
        const { accessToken, refreshToken } = await generateAccessRefreshToken(jwt, userUid)
        saveTokens(userUid, refreshToken)
        saveTokenInCookie(refresh, refreshToken, 86400)

        const googleUser = await getUser(userUid)
        googleUser.token = accessToken
        saveTokenInCookie(oauthUserInfo, JSON.stringify(googleUser), 60)
      }

      return redirect(`${TSBOARD.API.URI}/login/oauth`)
    },
    {
      query: t.Object({
        code: t.String(),
      }),
    },
  )
  .get("/naver/request", async ({ redirect }) => {
    const redirectURI = `${TSBOARD.API.URI}/tsapi/auth/naver/callback`
    const requestURI = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.OAUTH_NAVER_CLIENT_ID}&redirect_uri=${redirectURI}&state=${nanoid()}`
    return redirect(requestURI)
  })
  .get(
    "/naver/callback",
    async ({ jwt, cookie: { refresh, oauthUserInfo }, query: { code }, redirect }) => {
      if (!process.env.OAUTH_NAVER_SECRET) {
        return redirect(TSBOARD.API.URI)
      }

      if (code.length < 1) {
        return redirect(TSBOARD.API.URI)
      }

      const naverToken = await requestAccessToken("naver", code)
      let userInfo = await requestUserInfo("naver", naverToken.access_token)
      if (userInfo === null) {
        return redirect(TSBOARD.API.URI)
      }

      userInfo = userInfo.response
      if (userInfo.email) {
        const userUid = await registerUser(
          userInfo.email,
          userInfo.nickname,
          userInfo.profile_image,
        )
        const { accessToken, refreshToken } = await generateAccessRefreshToken(jwt, userUid)
        saveTokens(userUid, refreshToken)
        saveTokenInCookie(refresh, refreshToken, 86400)

        const naverUser = await getUser(userUid)
        naverUser.token = accessToken
        saveTokenInCookie(oauthUserInfo, JSON.stringify(naverUser), 60)
      }

      return redirect(`${TSBOARD.API.URI}/login/oauth`)
    },
    {
      query: t.Object({
        code: t.String(),
        state: t.String(),
      }),
    },
  )
  .get("/kakao/request", async ({ redirect }) => {
    const scope = "account_email,profile_image,profile_nickname"
    const redirectURI = `${TSBOARD.API.URI}/tsapi/auth/kakao/callback`
    const requestURI = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.OAUTH_KAKAO_CLIENT_ID}&redirect_uri=${redirectURI}&response_type=code&scope=${scope}`
    return redirect(requestURI)
  })
  .get(
    "/kakao/callback",
    async ({ jwt, cookie: { refresh, oauthUserInfo }, query: { code }, redirect }) => {
      if (!process.env.OAUTH_KAKAO_SECRET) {
        return redirect(TSBOARD.API.URI)
      }

      if (code.length < 1) {
        return redirect(TSBOARD.API.URI)
      }

      const kakaoToken = await requestAccessToken("kakao", code)
      let userInfo = await requestUserInfo("kakao", kakaoToken.access_token)
      if (userInfo === null) {
        return redirect(TSBOARD.API.URI)
      }

      userInfo = userInfo.kakao_account
      if (userInfo.email) {
        const userUid = await registerUser(
          userInfo.email,
          userInfo.profile.nickname,
          userInfo.profile.profile_image_url,
        )
        const { accessToken, refreshToken } = await generateAccessRefreshToken(jwt, userUid)
        saveTokens(userUid, refreshToken)
        saveTokenInCookie(refresh, refreshToken, 86400)

        const kakaoUser = await getUser(userUid)
        kakaoUser.token = accessToken
        saveTokenInCookie(oauthUserInfo, JSON.stringify(kakaoUser), 60)
      }

      return redirect(`${TSBOARD.API.URI}/login/oauth`)
    },
    {
      query: t.Object({
        code: t.String(),
      }),
    },
  )
  .get("/oauth/userinfo", async ({ cookie: { oauthUserInfo } }) => {
    let response = INIT_USER
    if (!oauthUserInfo.value || oauthUserInfo.value.length < 1) {
      return fail(`Unable to load your information from server.`, response)
    }
    return success(oauthUserInfo.value)
  })
