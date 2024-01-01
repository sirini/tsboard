/**
 * store/auth.ts
 *
 * 로그인 등 사용자 관련 상태 및 유틸리티 함수들
 */

import { SHA256 } from "crypto-js"
import { ref } from "vue"
import { useRouter } from "vue-router"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../server/index"
import { useUtilStore } from "./util"
import { User } from "../interface/auth"

const INVALID_EMAIL = "이메일 주소 형식에 맞지 않습니다."
const INVALID_PASSWORD =
  "비밀번호는 8글자 이상, 숫자/대문자/특수문자를 각각 하나 이상 포함해야 합니다."
const INVALID_NICKNAME =
  "이름은 2글자 이상 입력해 주시고, 우측에 체크 아이콘을 눌러 중복 여부도 확인해보세요."
const SIGNUP_COMPLETE = "회원 가입이 완료되었습니다! 지금 바로 로그인 해보세요!"

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter()
  const server = edenTreaty<App>(process.env.API!)
  const util = useUtilStore()
  const password = ref<string>("")
  const checkedPassword = ref<string>("")
  const idForReset = ref<string>("")
  const verificationCode = ref<string>("")
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
      return INVALID_EMAIL
    },
  ]

  // 비밀번호 입력란 체크
  const passwordRule = [
    (value: string) => {
      if (util.filters.password.test(value)) return true
      return INVALID_PASSWORD
    },
  ]

  // 닉네임 입력란 체크
  const nameRule = [
    (value: string) => {
      if (value?.length > 2) return true
      return INVALID_NICKNAME
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
      util.error(INVALID_EMAIL)
      return
    }
    if (util.filters.password.test(password.value) === false) {
      util.error(INVALID_PASSWORD)
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

  // 비밀번호 초기화하기
  async function resetPassword(): Promise<void> {
    if (util.filters.email.test(idForReset.value) === false) {
      util.error(INVALID_EMAIL)
      return
    }
    // do something
    util.success(`${idForReset.value}으로 비밀번호 초기화 메일을 발송하였습니다.`)
  }

  // 아이디(이메일) 중복 체크하기
  async function checkEmail(): Promise<void> {
    if (user.value.id.length < 6) {
      util.error(INVALID_EMAIL)
      return
    }
    const response = await server.api.auth.checkemail.post({
      email: user.value.id.trim(),
    })
    if (response.data!.success === false) {
      util.error(`이미 등록된 아이디(이메일) 입니다. 다른 이메일 주소를 넣어주세요!`)
      user.value.id = ""
      return
    }

    util.success(`${user.value.id}는 사용할 수 있는 아이디입니다.`)
  }

  // 이름 중복 체크하기
  async function checkName(): Promise<void> {
    if (user.value.name.length < 2) {
      util.error(INVALID_NICKNAME)
    }
    const response = await server.api.auth.checkname.post({
      name: user.value.name.trim(),
    })
    if (response.data!.success === false) {
      util.error(`이미 등록된 이름입니다. 다른 이름을 만들어보세요!`)
      user.value.name = ""
      return
    }

    util.success(`${user.value.name}는(은) 사용할 수 있는 이름입니다.`)
  }

  // 가입 양식 제출받기
  async function signup(): Promise<void> {
    if (util.filters.email.test(user.value.id) === false) {
      util.error(INVALID_EMAIL)
      return
    }
    if (util.filters.password.test(password.value) === false) {
      util.error(INVALID_PASSWORD)
      return
    }
    if (password.value !== checkedPassword.value) {
      util.error(`비밀번호를 서로 다르게 입력하셨습니다.`)
      return
    }
    if (user.value.name.length < 3) {
      util.error(INVALID_NICKNAME)
      return
    }

    const response = await server.api.auth.signup.post({
      email: user.value.id,
      password: SHA256(password.value).toString(),
      name: user.value.name,
    })
    if (response.data!.success === false) {
      util.error(`신규 사용자 등록에 실패하였습니다. (error: ${response.data!.error})`)
      return
    }
    if (response.data!.sendmail === false) {
      util.success(SIGNUP_COMPLETE)
      setTimeout(() => {
        util.go("login")
      }, 5000)
      return
    }
    util.success(
      `${user.value.id}로 메일을 보내드렸습니다. 인증 메일을 확인해 주시고, 가입 절차를 완료해 보세요!`,
    )
    setTimeout(() => {
      router.push({ name: "verify", params: { target: response.data!.target } })
    }, 3000)
  }

  // 인증 완료하기
  async function verify(target: number): Promise<void> {
    if (target < 1) {
      util.error(`인증 대상이 잘못 지정되어 있습니다.`)
      return
    }
    if (verificationCode.value.length !== 6) {
      util.error(`인증 코드는 6자리여야 합니다.`)
      return
    }
    if (user.value.id.length < 1) {
      util.error(`이메일 주소가 기입되어 있지 않습니다. 가입 화면으로 이동합니다.`)
      util.go("signup")
      return
    }
    if (user.value.name.length < 1) {
      util.error(`이름이 작성되지 않습니다. 가입 화면으로 이동합니다.`)
      util.go("signup")
      return
    }
    if (password.value.length < 8) {
      util.error(`비밀번호가 작성되지 않습니다. 가입 화면으로 이동합니다.`)
      util.go("signup")
      return
    }
    const response = await server.api.auth.verify.post({
      target,
      code: verificationCode.value,
      user: {
        email: user.value.id,
        name: user.value.name,
        password: SHA256(password.value).toString(),
      },
    })
    if (response.data!.success === false) {
      util.error(`인증 코드가 잘못되었습니다. 대소문자 등 다시 확인해 주세요.`)
      return
    }
    util.success(SIGNUP_COMPLETE)
    setTimeout(() => {
      util.go("login")
    }, 3000)
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
      util.error(INVALID_PASSWORD)
      return
    }

    // do something
    util.success("내 정보를 성공적으로 수정 하였습니다.")
  }

  return {
    user,
    password,
    checkedPassword,
    idForReset,
    verificationCode,
    emailRule,
    passwordRule,
    nameRule,
    login,
    logout,
    resetPassword,
    checkEmail,
    checkName,
    signup,
    verify,
    saveMyInfo,
  }
})
