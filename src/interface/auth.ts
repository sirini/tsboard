/**
 * interface/auth.ts
 *
 * 로그인 등 사용자 관련 인터페이스
 */

export interface User {
  uid: number
  name: string
  point: number
  level: number
  profile: string
  admin: boolean
}
