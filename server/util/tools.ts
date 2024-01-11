/**
 * server/util/tools
 *
 * 서버단에서 활용할 함수들 정의
 */

import { JWTPayloadSpec } from "@elysiajs/jwt"
import { Token } from "../../src/interface/auth"
import { saveTokens } from "../database/auth/authorization"

// 랜덤 문자 6개 반환하는 함수, 인증 코드로 활용한다
export function generateRandomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz0123456789"
  let random = ""

  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * chars.length)
    random += chars.charAt(index)
  }
  return random
}

interface Result {
  success: boolean
  error: string
  result: any
}

// Elysia 실패 메시지 리턴
export function fail(error: string): Result {
  return {
    success: false,
    error,
    result: null,
  }
}

// Elysia 성공 메시지 리턴
export function success(result: any = null): Result {
  return {
    success: true,
    error: "",
    result,
  }
}

// 액세스 토큰 [만료] & 리프레시 토큰 [유효] 때 액세스 토큰 업데이트 후 반환
export async function updateAccessToken(
  jwt: any,
  accessToken: string,
  refreshToken: string,
): Promise<string> {
  let newAccessToken = ""
  const access = (await jwt.verify(accessToken)) as
    | false
    | (Record<string, string | number> & JWTPayloadSpec)
  if (access === false) {
    return newAccessToken
  }
  const userUid = access.uid as number
  const accessTokenTime = access.signin as number
  const now = Date.now()

  if (accessTokenTime < now) {
    newAccessToken = await jwt.sign({
      uid: userUid,
      id: access.id,
      signin: Date.now(),
    })
    const token: Token = {
      access: newAccessToken,
      refresh: refreshToken,
    }
    saveTokens(userUid, token)
  }
  return newAccessToken
}
