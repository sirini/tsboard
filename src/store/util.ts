/**
 * store/util.ts
 * 
 * 여러 곳에서 자주 사용되는 유틸리티 함수들 모음
 */

import { ref } from "vue"
import { defineStore } from "pinia"

export const useUtilStore = defineStore("util", () => {
  const files = ref<File[]>([])
  const limit = ref<number>(10247680)
  const snackbar = ref<boolean>(false)
  const snackbarTimeout = ref<number>(3000)
  const snackbarText = ref<string>("")
  const searchOption = ref<string>("subject")
  const searchValue = ref<string>("")

  const uploadRule = [
    (value: any) => {
      return (
        !value ||
        !value.length ||
        value[0].size < limit.value ||
        `파일 크기는 ${limit.value / 1024}MB 이하여야 합니다.`
      )
    },
  ]
  const textRule = [
    (value: any) => {
      if (value?.length > 1) return true
      return "2글자 이상 입력해 주세요."
    },
  ]
  
  // 선택한 파일들을 파일 목록에 담기
  function read(event: MouseEvent): void {
    files.value = []
    const targets = (event?.target as HTMLInputElement).files
    if (targets) {
      const fileArray = Array.from(targets)
      for(const file of fileArray) {
        files.value.push(file)
      }
    }
  }

  return {
    files,
    limit,
    snackbar,
    snackbarTimeout,
    snackbarText,
    searchOption,
    searchValue,
    uploadRule,
    textRule,
    read,
  }
})