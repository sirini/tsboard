/**
 * store/auth
 *
 * 로그인, 내 정보 수정 등 사용자 관련 상태 및 함수들
 */

import { SHA256 } from "crypto-js"
import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../server/index"
import { useUtilStore } from "../util"
import { useHomeStore } from "../home"
import { User } from "../../interface/auth"
import { TEXT } from "../../messages/store/user/auth"
import { INIT_USER, USER_INFO_KEY } from "./const"
import { TSBOARD } from "../../../tsboard.config"

export const useAuthStore = defineStore("auth", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const util = useUtilStore()
  const home = useHomeStore()
  const password = ref<string>("")
  const checkedPassword = ref<string>("")
  const newProfile = ref<File | undefined>(undefined)
  const user = ref<User>(INIT_USER)
  loadUserInfo()

  // 아이디(이메일) 입력란 체크
  const emailRule = [
    (value: string) => {
      if (util.filters.email.test(value)) return true
      return TEXT[home.lang].INVALID_EMAIL
    },
  ]

  // 비밀번호 입력란 체크
  const passwordRule = [
    (value: string) => {
      if (util.filters.password.test(value)) return true
      return TEXT[home.lang].INVALID_PASSWORD
    },
  ]

  // 닉네임 입력란 체크
  const nameRule = [
    (value: string) => {
      if (value?.length > 2) return true
      return TEXT[home.lang].INVALID_NAME
    },
  ]

  // 기존에 로그인 한 사용자라면 스토리지 공간에서 정보 가져오기
  async function loadUserInfo(): Promise<void> {
    const savedUserInfo = window.localStorage.getItem(USER_INFO_KEY)
    if (!savedUserInfo) {
      return
    }

    user.value = JSON.parse(savedUserInfo) as User
    try {
      const response = await client.tsapi.auth.load.get({
        $headers: {
          authorization: user.value.token,
        },
        $query: {
          userUid: user.value.uid,
        },
      })

      if (!response.data) {
        return util.error(TEXT[home.lang].NO_RESPONSE)
      }
      if (response.data.success === false) {
        return util.error(`${TEXT[home.lang].FAILED_LOAD_MYINFO} (${response.data.error})`)
      }

      user.value = response.data.result.user as User
      user.value.signature = util.unescape(user.value.signature)
      updateUserToken(response.data.result.newAccessToken) // 마지막에 토큰 변경
    } catch (e) {
      util.error(TEXT[home.lang].FAILED_LOAD_MYINFO)
      logout()
      util.go("home")
    }
  }

  // 사용자 로그인하기
  async function login(): Promise<void> {
    if (util.filters.email.test(user.value.id) === false) {
      return util.error(TEXT[home.lang].INVALID_EMAIL)
    }
    const response = await client.tsapi.auth.signin.post({
      id: user.value.id.trim(),
      password: SHA256(password.value).toString(),
    })

    if (!response.data) {
      return util.error(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.error(TEXT[home.lang].INVALID_ID_PW)
    }
    user.value = response.data.result.user
    if (user.value) {
      window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(user.value))
    }
    util.success(`${TEXT[home.lang].WELCOME_USER}, ${user.value.name}!`, 2000)
    password.value = ""
    setTimeout(() => {
      util.go("home")
    }, 1000)
  }

  // 구글 OAuth 로그인 이후 결과 받아오기
  async function loadOAuthUserInfo(): Promise<void> {
    const response = await client.tsapi.auth.oauth.userinfo.get()

    if (!response.data) {
      return util.error(TEXT[home.lang].FAILED_LOAD_MYINFO)
    }
    if (response.data.success === false) {
      return util.error(`${TEXT[home.lang].FAILED_LOAD_MYINFO} (${response.data.error})`)
    }

    user.value = response.data.result as User
    if (user.value) {
      window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(user.value))
    }
    util.success(`${TEXT[home.lang].WELCOME_USER}, ${user.value.name}!`, 2000)
    setTimeout(() => {
      util.go("home")
    }, 1000)
  }

  // 사용자 로그아웃 하기
  async function logout(): Promise<void> {
    const token = user.value.token
    client.tsapi.auth.logout.post({
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
    util.success(TEXT[home.lang].GOODBYE_USER)
  }

  // 사용자 토큰 업데이트 하기
  function updateUserToken(token: string): void {
    if (!token || token.length < 1) {
      return
    }
    user.value.token = token
    window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(user.value))
  }

  // 변경할 프로필 사진 받기
  function selectProfileImage(event: Event): void {
    const input = event.target as HTMLInputElement
    if (!input.files) {
      return
    }
    newProfile.value = input.files[0] as File
    user.value.profile = URL.createObjectURL(newProfile.value)
  }

  // 내 정보 수정하기
  async function updateMyInfo(): Promise<void> {
    const name = user.value.name.trim()
    if (name.length < 2) {
      return util.error(TEXT[home.lang].INVALID_NAME)
    }
    if (password.value.length > 7 && password.value !== checkedPassword.value) {
      return util.error(TEXT[home.lang].DIFFERENT_PASSWORD)
    }
    if (password.value.length > 7 && util.filters.password.test(password.value) === false) {
      return util.error(TEXT[home.lang].INVALID_PASSWORD)
    }

    const response = await client.tsapi.auth.update.patch({
      $headers: {
        authorization: user.value.token,
      },
      $query: {
        userUid: user.value.uid,
      },
      name: user.value.name,
      password: password.value.length < 1 ? "" : SHA256(password.value).toString(),
      signature: user.value.signature,
      profile: newProfile.value,
    })

    if (!response.data) {
      return util.error(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.error(`${TEXT[home.lang].FAILED_UPDATE_MYINFO} (${response.data.error})`)
    }
    updateUserToken(response.data.result.newAccessToken)
    loadUserInfo()
    password.value = ""
    checkedPassword.value = ""
    util.success(TEXT[home.lang].MYINFO_SUCCESS)
  }

  return {
    user,
    password,
    checkedPassword,
    emailRule,
    passwordRule,
    nameRule,
    login,
    loadOAuthUserInfo,
    logout,
    updateMyInfo,
    selectProfileImage,
    updateUserToken,
  }
})
