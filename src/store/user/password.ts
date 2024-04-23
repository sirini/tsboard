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
import { TSBOARD } from "../../../tsboard.config"

export const usePasswordStore = defineStore("password", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const loading = ref<boolean>(false)

  // 비밀번호 초기화 요청하기
  async function askResetPassword(): Promise<void> {
    if (util.filters.email.test(auth.user.id) === false) {
      return util.error(TEXT[home.lang].INVALID_EMAIL)
    }

    loading.value = true

    const response = await client.tsapi.auth.reset.password.post({
      email: auth.user.id,
      lang: home.lang as number,
    })

    if (!response.data) {
      return util.error(TEXT[home.lang].NO_RESPONSE)
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
      return util.error(TEXT[home.lang].INVALID_PASSWORD)
    }
    if (auth.password !== auth.checkedPassword) {
      return util.error(TEXT[home.lang].DIFFERENT_PASSWORD)
    }

    const response = await client.tsapi.auth.change.password.post({
      target,
      code,
      password: SHA256(auth.password).toString(),
    })
    if (response.data!.success === false) {
      return util.error(TEXT[home.lang].UNABLE_CHANGE_PASSWORD)
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
