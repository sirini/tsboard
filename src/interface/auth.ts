/**
 * interface/auth.ts
 *
 * 로그인 등 사용자 관련 인터페이스
 */

export interface User {
  uid: number
  id: string
  name: string
  profile: string
  level: number
  point: number
  signature: string
  signup: string
  signin: string
  admin: boolean
}
