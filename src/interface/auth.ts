/**
 * interface/auth.ts
 *
 * 로그인 등 사용자 관련 인터페이스
 */

export interface Token {
  access: string
  refresh: string
}

export interface User {
  uid: number
  id: string
  name: string
  profile: string
  level: number
  point: number
  signature: string
  signup: number
  signin: number
  admin: boolean
  token: string
}

export interface Signup {
  email: string
  password: string
  name: string
}

export interface ChangePassword {
  target: number
  code: string
  password: string
}
