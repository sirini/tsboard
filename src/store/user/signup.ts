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
import type { App } from "../../../server/index"
import { useUtilStore } from "../util"
import { useAuthStore } from "./auth"
import { useHomeStore } from "../home"
import { TEXT } from "../../messages/store/user/auth"
import { TSBOARD } from "../../../tsboard.config"

export const useSignupStore = defineStore("signup", () => {
  const router = useRouter()
  const util = useUtilStore()
  const auth = useAuthStore()
  const home = useHomeStore()
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const verificationCode = ref<string>("")
  const loading = ref<boolean>(false)

  // 아이디(이메일) 중복 체크하기
  async function checkEmail(): Promise<void> {
    if (auth.user.id.length < 6) {
      return util.error(TEXT[home.lang].INVALID_EMAIL)
    }

    const response = await client.tsapi.auth.checkemail.post({
      email: auth.user.id.trim(),
    })

    if (!response.data) {
      return util.error(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      util.error(TEXT[home.lang].EXIST_EMAIL)
      auth.user.id = ""
      return
    }
    util.success(TEXT[home.lang].AVAILABLE_EMAIL)
  }

  // 이름 중복 체크하기
  async function checkName(): Promise<void> {
    if (auth.user.name.length < 2) {
      return util.error(TEXT[home.lang].INVALID_NAME)
    }

    const response = await client.tsapi.auth.checkname.post({
      name: auth.user.name.trim(),
      userUid: auth.user.uid,
    })

    if (!response.data) {
      return util.error(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      util.error(TEXT[home.lang].EXIST_NAME)
      auth.user.name = ""
      return
    }
    util.success(TEXT[home.lang].AVAILABLE_NAME)
  }

  // 가입 양식 제출받기
  async function submit(): Promise<void> {
    if (util.filters.email.test(auth.user.id) === false) {
      return util.error(TEXT[home.lang].INVALID_EMAIL)
    }
    if (util.filters.password.test(auth.password) === false) {
      return util.error(TEXT[home.lang].INVALID_PASSWORD)
    }
    if (auth.password !== auth.checkedPassword) {
      return util.error(TEXT[home.lang].DIFFERENT_PASSWORD)
    }
    if (auth.user.name.length < 3) {
      return util.error(TEXT[home.lang].INVALID_NAME)
    }

    loading.value = true

    const response = await client.tsapi.auth.signup.post({
      email: auth.user.id,
      password: SHA256(auth.password).toString(),
      name: auth.user.name,
      lang: home.lang as number,
    })

    if (!response.data) {
      return util.error(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      util.error(TEXT[home.lang].FAILED_ADD_USER)
      loading.value = false
      return
    }
    if (response.data.result.sendmail === false) {
      util.success(TEXT[home.lang].SIGNUP_COMPLETE)
      setTimeout(() => {
        util.go("login")
      }, 5000)
      loading.value = false
      return
    }
    util.success(`${auth.user.id} ${TEXT[home.lang].SENT_VERIFICATION}`)
    router.push({ name: "verify", params: { target: response.data.result.target } })
    loading.value = false
  }

  // 인증 완료하기
  async function verify(target: number): Promise<void> {
    if (target < 1) {
      return util.error(TEXT[home.lang].WRONG_VERIFY_TARGET)
    }
    if (verificationCode.value.length !== 6) {
      return util.error(TEXT[home.lang].WRONG_VERIFICATION_LENGTH)
    }
    if (auth.user.id.length < 1) {
      util.error(TEXT[home.lang].VERIFY_EMPTY_EMAIL)
      util.go("signup")
      return
    }
    if (auth.user.name.length < 1) {
      util.error(TEXT[home.lang].VERIFY_EMPTY_NAME)
      util.go("signup")
      return
    }
    if (auth.password.length < 8) {
      util.error(TEXT[home.lang].VERIFY_EMPTY_PASSWORD)
      util.go("signup")
      return
    }

    const response = await client.tsapi.auth.verify.post({
      target,
      code: verificationCode.value,
      user: {
        email: auth.user.id,
        name: auth.user.name,
        password: SHA256(auth.password).toString(),
      },
      lang: home.lang as number,
    })

    if (!response.data) {
      return util.error(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.error(TEXT[home.lang].WRONG_VERIFICATION_CODE)
    }
    util.success(TEXT[home.lang].SIGNUP_COMPLETE)
    util.go("login")
  }

  return {
    loading,
    verificationCode,
    checkEmail,
    checkName,
    submit,
    verify,
  }
})
