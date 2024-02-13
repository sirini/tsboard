/**
 * store/auth
 *
 * 로그인, 내 정보 수정 등 사용자 관련 상태 및 함수들
 */

import { SHA256 } from "crypto-js"
import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../server/index"
import { useUtilStore } from "./util"
import { User } from "../interface/auth"
import { AUTH, USER_INFO_KEY } from "../messages/store/auth"

export const useAuthStore = defineStore("auth", () => {
  const server = edenTreaty<App>(process.env.API!)
  const util = useUtilStore()
  const password = ref<string>("")
  const checkedPassword = ref<string>("")
  const newProfile = ref<File | undefined>(undefined)
  const user = ref<User>({
    uid: 0,
    id: "sirini@gmail.com",
    name: "",
    profile: "/no-profile.svg",
    level: 0,
    point: 0,
    signature: "",
    signup: 0,
    signin: 0,
    admin: false,
    token: "",
  })
  loadUserInfo()

  // 아이디(이메일) 입력란 체크
  const emailRule = [
    (value: string) => {
      if (util.filters.email.test(value)) return true
      return AUTH.INVALID_EMAIL
    },
  ]

  // 비밀번호 입력란 체크
  const passwordRule = [
    (value: string) => {
      if (util.filters.password.test(value)) return true
      return AUTH.INVALID_PASSWORD
    },
  ]

  // 닉네임 입력란 체크
  const nameRule = [
    (value: string) => {
      if (value?.length > 2) return true
      return AUTH.INVALID_NAME
    },
  ]

  // 기존에 로그인 한 사용자라면 스토리지 공간에서 정보 가져오기
  function loadUserInfo(): void {
    const storageUserInfo = window.localStorage.getItem(USER_INFO_KEY) || ""
    if (storageUserInfo.length > 0) {
      user.value = JSON.parse(storageUserInfo)
    }
  }

  // 사용자 로그인하기
  async function login(): Promise<void> {
    if (util.filters.email.test(user.value.id) === false) {
      util.error(AUTH.INVALID_EMAIL)
      return
    }
    const response = await server.api.auth.signin.post({
      id: user.value.id.trim(),
      password: SHA256(password.value).toString(),
    })
    if (!response.data) {
      util.error(AUTH.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.error(AUTH.INVALID_ID_PW)
      return
    }
    user.value = response.data.result.user as User
    if (user.value) {
      window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(user.value))
    }
    util.success(`${AUTH.WELCOME_USER}, ${user.value.name}!`, 2000)

    setTimeout(() => {
      util.go("home")
    }, 1000)
  }

  // 사용자 로그아웃 하기
  async function logout(): Promise<void> {
    const token = user.value.token
    server.api.auth.logout.post({
      $headers: {
        authorization: token,
      },
    })
    user.value.uid = 0
    user.value.admin = false
    user.value.token = ""
    user.value.name = ""
    user.value.level = 0
    user.value.point = 0
    window.localStorage.removeItem(USER_INFO_KEY)
    util.success(AUTH.GOODBYE_USER)
  }

  // 사용자 토큰 업데이트 하기
  function updateUserToken(token: string): void {
    if (token.length < 1) {
      return
    }
    user.value.token = token
    window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(user.value))
  }

  // 변경할 프로필 사진 받기
  function selectProfileImage(event: Event): void {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return
    newProfile.value = input.files[0] as File
    user.value.profile = URL.createObjectURL(newProfile.value)
  }

  // 내 정보 수정하기
  async function updateMyInfo(): Promise<void> {
    const name = user.value.name.trim()
    if (name.length < 2) {
      util.error(AUTH.INVALID_NAME)
      return
    }
    if (password.value.length > 7 && password.value !== checkedPassword.value) {
      util.error(AUTH.DIFFERENT_PASSWORD)
      return
    }
    if (password.value.length > 7 && util.filters.password.test(password.value) === false) {
      util.error(AUTH.INVALID_PASSWORD)
      return
    }
    const response = await server.api.auth.update.patch({
      $headers: {
        authorization: user.value.token,
      },
      name: user.value.name,
      password: password.value.length < 1 ? "" : SHA256(password.value).toString(),
      signature: user.value.signature,
      profile: newProfile.value,
    })
    if (!response.data) {
      util.error(AUTH.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.error(`${AUTH.FAILED_UPDATE_MYINFO} (${response.data.error})`)
      return
    }
    if (!response.data.result) {
      util.error(AUTH.FAILED_UPDATE_MYINFO)
      return
    }
    updateUserToken(response.data.result.newAccessToken!)
    loadUserInfo()
    password.value = ""
    checkedPassword.value = ""
    util.success(AUTH.MYINFO_SUCCESS)
  }

  return {
    user,
    password,
    checkedPassword,
    emailRule,
    passwordRule,
    nameRule,
    login,
    logout,
    updateMyInfo,
    selectProfileImage,
    updateUserToken,
  }
})
