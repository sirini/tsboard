import { Cookie } from "elysia"
import { AUTH, TSBOARD } from "../../../tsboard.config"
import { JWTPayloadSpec } from "@elysiajs/jwt"

type ServiceProvider = "google" | "naver" | "kakao"

// 쿠키에 토큰 저장하기
export function saveTokenInCookie(cookie: Cookie<any>, value: string, maxAge: number): void {
  cookie.set({
    value,
    maxAge: AUTH.JWT.REFRESH_TIMEOUT * maxAge,
    path: "/",
    httpOnly: AUTH.COOKIE.HTTP_ONLY,
    secure: AUTH.COOKIE.SECURE,
  })
}

// 토큰 요청 보내기
export async function requestAccessToken(service: ServiceProvider, code: string): Promise<any> {
  let client_id = process.env.OAUTH_GOOGLE_CLIENT_ID || ""
  let client_secret = process.env.OAUTH_GOOGLE_SECRET || ""
  let url = "https://oauth2.googleapis.com/token"
  let additionalHeader = {}

  if (service === "naver") {
    client_id = process.env.OAUTH_NAVER_CLIENT_ID || ""
    client_secret = process.env.OAUTH_NAVER_SECRET || ""
    url = "https://nid.naver.com/oauth2.0/token"
    additionalHeader = {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    }
  } else if (service === "kakao") {
    client_id = process.env.OAUTH_KAKAO_CLIENT_ID || ""
    client_secret = process.env.OAUTH_KAKAO_SECRET || ""
    url = "https://kauth.kakao.com/oauth/token"
    additionalHeader = {}
  }

  let result: any | null = null
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...additionalHeader,
    },
    body: new URLSearchParams({
      code,
      client_id,
      client_secret,
      redirect_uri: `${TSBOARD.API.URI}/tsapi/auth/${service}/callback`,
      grant_type: "authorization_code",
    }),
  })

  result = await response.json()
  return result
}

// 사용자 정보 요청 보내기
export async function requestUserInfo(
  service: ServiceProvider,
  token: string | undefined,
): Promise<any | null> {
  if (!token) {
    return null
  }

  let url = "https://www.googleapis.com/oauth2/v2/userinfo"
  if (service === "naver") {
    url = "https://openapi.naver.com/v1/nid/me"
  } else if (service === "kakao") {
    url = "https://kapi.kakao.com/v2/user/me"
  }

  let result: any | null = null
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  result = await response.json()
  return result
}

// 액세스, 리프레시 토큰 생성하여 반환
export async function generateAccessRefreshToken(
  jwt: {
    readonly sign: (
      morePayload: Record<string, string | number> & JWTPayloadSpec,
    ) => Promise<string>
    readonly verify: (jwt?: string | undefined) => Promise<any>
  },
  userUid: number,
): Promise<{ accessToken: string; refreshToken: string }> {
  let result = {
    accessToken: "",
    refreshToken: "",
  }

  const now = Math.floor(Date.now() / 1000)
  result.accessToken = await jwt.sign({
    uid: userUid,
    exp: now + AUTH.JWT.ACCESS_TIMEOUT * 60,
  })
  result.refreshToken = await jwt.sign({
    exp: now + AUTH.JWT.REFRESH_TIMEOUT * 60 * 60 * 24,
  })

  return result
}
