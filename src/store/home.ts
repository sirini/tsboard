/**
 * store/home.ts
 *
 * 웹사이트 내에서 활용 가능한 각종 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"

export const useHomeStore = defineStore("home", () => {
  const drawer = ref<boolean>(false)
  const color = ref<string>("blue-grey-lighten-5")
  const footerColor = ref<string>("white")

  return {
    drawer,
    color,
    footerColor,
  }
})
