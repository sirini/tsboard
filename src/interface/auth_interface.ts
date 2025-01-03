// 회원가입 시 리턴 타입 정의
export type SignupResult = {
  sendmail: boolean
  target: number
}

// 비밀번호 초기화 시 리턴 타입
export type ResetPasswordResult = {
  sendmail: boolean
}
