/**
 * store/home
 *
 * 웹사이트 내에서 활용 가능한 각종 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../server/index"
import { useAuthStore } from "./auth"

export const useHomeStore = defineStore("home", () => {
  const server = edenTreaty<App>(process.env.API!)
  const auth = useAuthStore()
  const drawer = ref<boolean>(false)
  const color = ref<string>("blue-grey-lighten-5")
  const footerColor = ref<string>("white")

  // 방문 기록 저장하기 (로그인 한 사용자만 체크)
  async function visit(): Promise<void> {
    if (auth.user.uid < 1) {
      return
    }
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const today = `${year}${month}${day}`

    const lastVisit = window.localStorage.getItem("tsboardVisit") ?? ""
    if (lastVisit === today) {
      return
    }
    window.localStorage.setItem("tsboardVisit", today)

    server.api.home.visit.get({
      $query: {
        userUid: auth.user.uid,
      },
    })
  }

  return {
    drawer,
    color,
    footerColor,
    visit,
  }
})
