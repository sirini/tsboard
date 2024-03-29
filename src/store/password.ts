/**
 * store/password
 *
 * 사용자 비밀번호 초기화 관련 상태 및 함수들
 */

import { ref } from "vue"
import { SHA256 } from "crypto-js"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../server/index"
import { useAuthStore } from "./user/auth"
import { useUtilStore } from "./util"
import { AUTH } from "../messages/store/user/auth"

export const usePasswordStore = defineStore("password", () => {
  const server = edenTreaty<App>(process.env.API!)
  const auth = useAuthStore()
  const util = useUtilStore()
  const loading = ref<boolean>(false)

  // 비밀번호 초기화 요청하기
  async function askResetPassword(): Promise<void> {
    if (util.filters.email.test(auth.user.id) === false) {
      util.error(AUTH.INVALID_EMAIL)
      return
    }
    loading.value = true

    const response = await server.api.auth.resetpassword.post({
      email: auth.user.id,
    })
    if (!response.data) {
      util.error(AUTH.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.error(AUTH.INVALID_EMAIL)
      loading.value = false
      return
    }
    if (response.data.result.sendmail === false) {
      util.success(AUTH.ASKED_RESET_PASSWORD)
      loading.value = false
      return
    }
    util.success(AUTH.SENT_RESET_PASSWORD)
    loading.value = false
  }

  // 비밀번호 변경하기
  async function changePassword(target: number, code: string): Promise<void> {
    if (util.filters.password.test(auth.password) === false) {
      util.error(AUTH.INVALID_PASSWORD)
      return
    }
    if (auth.password !== auth.checkedPassword) {
      util.error(AUTH.DIFFERENT_PASSWORD)
      return
    }

    const response = await server.api.auth.changepassword.post({
      target,
      code,
      password: SHA256(auth.password).toString(),
    })
    if (response.data!.success === false) {
      util.error(AUTH.UNABLE_CHANGE_PASSWORD)
      return
    }
    util.success(AUTH.SUCCESS_CHANGE_PASSWORD)
    util.go("login")
  }

  return {
    loading,
    askResetPassword,
    changePassword,
  }
})
