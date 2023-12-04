/**
 * store/util.ts
 *
 * 여러 곳에서 자주 사용되는 유틸리티 함수들 모음
 */

import { ref } from "vue"
import { useRouter } from "vue-router"
import { defineStore } from "pinia"

export const useUtilStore = defineStore("util", () => {
  const router = useRouter()
  const snackbar = ref<boolean>(false)
  const snackbarTimeout = ref<number>(3000)
  const snackbarText = ref<string>("")
  const alertbar = ref<boolean>(false)
  const alertType = ref<"success" | "error" | "info">("error")
  const alertText = ref<string>("")
  const alertTimeout = ref<number>(5000)
  const searchOption = ref<string>("subject")
  const searchValue = ref<string>("")
  const filters = {
    basic: /[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gim,
    nospace: /[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/ ]/gim,
    email: /^([0-9a-z_\.-]+)@([0-9a-z_-]+)(\.[a-z]+){1,2}$/,
    password: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/,
    url: /(http(s)?:\/\/)(www\.)?[-a-zA-Z0-9@:%._\+\/~#=]{2,256}\.(jpg|jpeg|png|gif)?\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/,
    youtube: /(https:\/\/)(www\.)?(youtu(be)?)\.(be|com)?\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/,
  }

  // 스낵 메시지 보여주기
  function snack(message: string, timeout: number = 3000): void {
    snackbarText.value = message
    snackbarTimeout.value = timeout
    snackbar.value = true
  }

  // 상단 알림 메시지 보여주기
  function alert(
    message: string,
    type: "success" | "error" | "info" = "error",
    timeout: number = 5000,
  ): void {
    alertText.value = message
    alertType.value = type
    alertbar.value = true
    alertTimeout.value = timeout
  }

  // 페이지 이동하기
  function go(name: string, id: string = "", no: number = 0): void {
    if (id.length < 1) {
      router.push({ name })
      return
    }
    if (no < 1) {
      router.push({ name, params: { id } })
      return
    }
    router.push({ name, params: { id, no } })
  }

  // 페이지 뒤로가기
  function back(): void {
    router.back()
  }

  return {
    snackbar,
    snackbarTimeout,
    snackbarText,
    alertbar,
    alertType,
    alertText,
    alertTimeout,
    searchOption,
    searchValue,
    filters,
    snack,
    alert,
    go,
    back,
  }
})
