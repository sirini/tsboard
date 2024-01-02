/**
 * store/auth
 *
 * 로그인 등 사용자 관련 상태 및 함수들
 */

import { SHA256 } from "crypto-js"
import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../server/index"
import { useUtilStore } from "./util"
import { User } from "../interface/auth"
import { AUTH } from "../messages/store/auth"

export const useAuthStore = defineStore("auth", () => {
  const server = edenTreaty<App>(process.env.API!)
  const util = useUtilStore()
  const password = ref<string>("")
  const checkedPassword = ref<string>("")
  const user = ref<User>({
    uid: 0,
    id: "",
    name: "",
    profile: "/no-profile.png",
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
    const storageUserInfo = window.localStorage.getItem("tsboardUserInfo") || ""
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
    if (util.filters.password.test(password.value) === false) {
      util.error(AUTH.INVALID_PASSWORD)
      return
    }

    const response = await server.api.auth.signin.post({
      id: user.value.id.trim(),
      password: SHA256(password.value).toString(),
    })
    if (response.data!.success === false) {
      util.error(`아이디 혹은 비밀번호가 올바르지 않습니다.`)
      return
    }
    user.value = response.data!.user!
    window.localStorage.setItem("tsboardUserInfo", JSON.stringify(user.value))

    util.success(`환영합니다, ${user.value.name}님!`, 2000)

    setTimeout(() => {
      util.go("home")
    }, 1000)
  }

  // 사용자 로그아웃 하기
  async function logout(): Promise<void> {
    await server.api.auth.logout.post({ token: user.value.token })

    user.value.uid = 0
    user.value.admin = false
    user.value.token = ""
    user.value.name = ""
    user.value.level = 0
    user.value.point = 0
    user.value.signature = ""
    window.localStorage.removeItem("tsboardUserInfo")

    util.success(`다음에 다시 뵐께요!`)
  }

  // 내 정보 수정하기
  async function saveMyInfo(): Promise<void> {
    const name = user.value.name.trim()
    if (name.length < 2) {
      util.error("이름은 2글자 이상 입력해 주세요.")
      return
    }
    if (password.value !== checkedPassword.value) {
      util.error("입력하신 비밀번호가 서로 맞지 않습니다.")
      return
    }
    if (util.filters.password.test(password.value) === false) {
      util.error(AUTH.INVALID_PASSWORD)
      return
    }

    // do something
    util.success("내 정보를 성공적으로 수정 하였습니다.")
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
    saveMyInfo,
  }
})
