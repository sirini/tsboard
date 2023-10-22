/**
 * store/auth.ts
 *
 * 로그인 등 사용자 관련 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { useRouter } from "vue-router"
import { defineStore } from "pinia"

export interface User {
  uid: number
  name: string
  point: number
  level: number
  profile: string
  admin: boolean
}

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter()
  const user = ref<User>({
    uid: 0,
    name: "",
    point: 0,
    level: 0,
    profile: "",
    admin: false
  })

  // 로그인 페이지로 이동하기
  function login(): void {
    router.push({ name: "login" })
  }

  // 비밀번호 찾기 페이지로 이동하기
  function resetPassword(): void {
    router.push({ name: "resetpassword" })
  }

  // 회원가입하기 페이지로 이동하기
  function signup(): void {
    router.push({ name: "signup" })
  }

  // 아이디(이메일) 입력란 체크
  const emailRule = [
    (value: any) => {
      if (/^([0-9a-z_\.-]+)@([0-9a-z_-]+)(\.[a-z]+){1,2}$/.test(value)) return true
      return "이메일 주소 형식이 맞지 않습니다."
    },
  ]

  // 비밀번호 입력란 체크
  const passwordRule = [
    (value: any) => {
      if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(value)) return true
      return "비밀번호는 8글자 이상, 숫자/대문자/특수문자를 각각 하나 이상 포함해야 합니다."
    },
  ]

  // 닉네임 입력란 체크
  const nicknameRule = [
    (value: any) => {
      if (value?.length > 2) return true
      return "닉네임은 3글자 이상 입력해 주시고, 우측에 체크 아이콘을 눌러 중복 여부도 확인해보세요."
    },
  ]

  return { user, emailRule, passwordRule, nicknameRule, login, resetPassword, signup }
})
