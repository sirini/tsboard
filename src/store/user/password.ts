import { SHA256 } from "crypto-js"
import { defineStore } from "pinia"
import { ref } from "vue"
import { TSBOARD } from "../../../tsboard.config"
import { TEXT } from "../../messages/store/user/auth"
import { useHomeStore } from "../home"
import { useUtilStore } from "../util"
import { useAuthStore } from "./auth"
import axios from "axios"

export const usePasswordStore = defineStore("password", () => {
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

    const fd = new FormData()
    fd.append("email", auth.user.id)
    fd.append("lang", home.lang.toString())

    const response = await axios.post(`${TSBOARD.API}/auth/reset/password`, fd)

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

    const fd = new FormData()
    fd.append("target", target.toString())
    fd.append("code", code)
    fd.append("password", SHA256(auth.password).toString())

    const response = await axios.post(`${TSBOARD.API}/user/change/password`, fd)

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
