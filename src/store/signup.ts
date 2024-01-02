/**
 * store/signup
 *
 * 회원 가입 관련 상태 및 함수들
 */

import { ref } from "vue"
import { SHA256 } from "crypto-js"
import { defineStore } from "pinia"
import { useRouter } from "vue-router"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../server/index"
import { useUtilStore } from "./util"
import { useAuthStore } from "./auth"
import { AUTH } from "../messages/store/auth"

export const useSignupStore = defineStore("signup", () => {
  const router = useRouter()
  const util = useUtilStore()
  const auth = useAuthStore()
  const server = edenTreaty<App>(process.env.API!)
  const verificationCode = ref<string>("")

  // 아이디(이메일) 중복 체크하기
  async function checkEmail(): Promise<void> {
    if (auth.user.id.length < 6) {
      util.error(AUTH.INVALID_EMAIL)
      return
    }
    const response = await server.api.auth.checkemail.post({
      email: auth.user.id.trim(),
    })
    if (response.data!.success === false) {
      util.error(AUTH.EXIST_EMAIL)
      auth.user.id = ""
      return
    }
    util.success(AUTH.AVAILABLE_EMAIL)
  }

  // 이름 중복 체크하기
  async function checkName(): Promise<void> {
    if (auth.user.name.length < 2) {
      util.error(AUTH.INVALID_NAME)
    }
    const response = await server.api.auth.checkname.post({
      name: auth.user.name.trim(),
    })
    if (response.data!.success === false) {
      util.error(AUTH.EXIST_NAME)
      auth.user.name = ""
      return
    }
    util.success(AUTH.AVAILABLE_NAME)
  }

  // 가입 양식 제출받기
  async function submit(): Promise<void> {
    if (util.filters.email.test(auth.user.id) === false) {
      util.error(AUTH.INVALID_EMAIL)
      return
    }
    if (util.filters.password.test(auth.password) === false) {
      util.error(AUTH.INVALID_PASSWORD)
      return
    }
    if (auth.password !== auth.checkedPassword) {
      util.error(AUTH.DIFFERENT_PASSWORD)
      return
    }
    if (auth.user.name.length < 3) {
      util.error(AUTH.INVALID_NAME)
      return
    }

    const response = await server.api.auth.signup.post({
      email: auth.user.id,
      password: SHA256(auth.password).toString(),
      name: auth.user.name,
    })
    if (response.data!.success === false) {
      util.error(AUTH.FAILED_ADD_USER)
      return
    }
    if (response.data!.sendmail === false) {
      util.success(AUTH.SIGNUP_COMPLETE)
      setTimeout(() => {
        util.go("login")
      }, 5000)
      return
    }
    util.success(
      `${auth.user.id}로 메일을 보내드렸습니다. 인증 메일을 확인해 주시고, 가입 절차를 완료해 보세요!`,
    )
    router.push({ name: "verify", params: { target: response.data!.target! } })
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
    if (auth.user.id.length < 1) {
      util.error(`이메일 주소가 기입되어 있지 않습니다. 가입 화면으로 이동합니다.`)
      util.go("signup")
      return
    }
    if (auth.user.name.length < 1) {
      util.error(`이름이 작성되지 않습니다. 가입 화면으로 이동합니다.`)
      util.go("signup")
      return
    }
    if (auth.password.length < 8) {
      util.error(`비밀번호가 작성되지 않습니다. 가입 화면으로 이동합니다.`)
      util.go("signup")
      return
    }
    const response = await server.api.auth.verify.post({
      target,
      code: verificationCode.value,
      user: {
        email: auth.user.id,
        name: auth.user.name,
        password: SHA256(auth.password).toString(),
      },
    })
    if (response.data!.success === false) {
      util.error(`인증 코드가 잘못되었습니다. 대소문자 등 다시 확인해 주세요.`)
      return
    }
    util.success(AUTH.SIGNUP_COMPLETE)
    util.go("login")
  }

  return {
    verificationCode,
    checkEmail,
    checkName,
    submit,
    verify,
  }
})
