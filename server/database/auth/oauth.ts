import { Cookie } from "elysia"
import { AUTH } from "../../../tsboard.config"

// 쿠키에 토큰 저장하기
export function saveTokenCookie(cookie: Cookie<any>, value: string, maxAge: number): void {
  cookie.set({
    value: cookie,
    maxAge: AUTH.JWT.REFRESH_TIMEOUT * maxAge,
    path: "/",
    httpOnly: AUTH.COOKIE.HTTP_ONLY,
    secure: AUTH.COOKIE.SECURE,
  })
}
