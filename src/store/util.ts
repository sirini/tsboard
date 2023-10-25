/**
 * store/util.ts
 *
 * 여러 곳에서 자주 사용되는 유틸리티 함수들 모음
 */

import { ref } from "vue"
import { defineStore } from "pinia"

export const useUtilStore = defineStore("util", () => {
  const snackbar = ref<boolean>(false)
  const snackbarTimeout = ref<number>(3000)
  const snackbarText = ref<string>("")
  const searchOption = ref<string>("subject")
  const searchValue = ref<string>("")
  const filter = /[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gim
  const filterNoSpace = /[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/ ]/gim

  // 스낵 메시지 보여주기
  function snack(message: string, timeout: number = 3000): void {
    snackbarText.value = message
    snackbarTimeout.value = timeout
    snackbar.value = true
  }

  return {
    snackbar,
    snackbarTimeout,
    snackbarText,
    searchOption,
    searchValue,
    filter,
    filterNoSpace,
    snack,
  }
})
