export interface Token {
  access: string
  refresh: string
}

export interface SignIn {
  uid: number
  name: string
  profile: string
  level: number
  point: number
  signature: string
  signup: number
  signin: number
}
