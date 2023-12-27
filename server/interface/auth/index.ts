export interface Token {
  access: string
  refresh: string
}

export interface SignIn {
  uid: number
  id: string
  name: string
  profile: string
  level: number
  point: number
  signature: string
  signup: number
  signin: number
}
