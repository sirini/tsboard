/**
 * store/password
 *
 * 사용자 비밀번호 초기화 관련 상태 및 함수들
 */

import { ref } from "vue"
import { SHA256 } from "crypto-js"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../server/index"
import { useAuthStore } from "./auth"
import { useUtilStore } from "../util"
import { useHomeStore } from "../home"
import { TEXT } from "../../messages/store/user/auth"

export const usePasswordStore = defineStore("password", () => {
  const server = edenTreaty<App>(process.env.API!)
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const loading = ref<boolean>(false)

  // 비밀번호 초기화 요청하기
  async function askResetPassword(): Promise<void> {
    if (util.filters.email.test(auth.user.id) === false) {
      util.error(TEXT[home.lang].INVALID_EMAIL)
      return
    }
    loading.value = true

    const response = await server.api.auth.resetpassword.post({
      email: auth.user.id,
    })
    if (!response.data) {
      util.error(TEXT[home.lang].NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.error(TEXT[home.lang].INVALID_EMAIL)
      loading.value = false
      return
    }
    if (response.data.result.sendmail === false) {
      util.success(TEXT[home.lang].ASKED_RESET_PASSWORD)
      loading.value = false
      return
    }
    util.success(TEXT[home.lang].SENT_RESET_PASSWORD)
    loading.value = false
  }

  // 비밀번호 변경하기
  async function changePassword(target: number, code: string): Promise<void> {
    if (util.filters.password.test(auth.password) === false) {
      util.error(TEXT[home.lang].INVALID_PASSWORD)
      return
    }
    if (auth.password !== auth.checkedPassword) {
      util.error(TEXT[home.lang].DIFFERENT_PASSWORD)
      return
    }

    const response = await server.api.auth.changepassword.post({
      target,
      code,
      password: SHA256(auth.password).toString(),
    })
    if (response.data!.success === false) {
      util.error(TEXT[home.lang].UNABLE_CHANGE_PASSWORD)
      return
    }
    util.success(TEXT[home.lang].SUCCESS_CHANGE_PASSWORD)
    util.go("login")
  }

  return {
    loading,
    askResetPassword,
    changePassword,
  }
})
