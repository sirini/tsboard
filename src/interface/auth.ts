/**
 * interface/auth.ts
 *
 * 로그인 등 사용자 관련 인터페이스
 */

export type Token = {
  access: string
  refresh: string
}

export type UserModifyResult = {
  uid: number
  id: string
  name: string
  profile: string
  level: number
  point: number
  signature: string
}

export type User = UserModifyResult & {
  signup: number
  signin: number
  admin: boolean
  token: string
}

export type Signup = {
  email: string
  password: string
  name: string
}

export type ChangePassword = {
  target: number
  code: string
  password: string
}
