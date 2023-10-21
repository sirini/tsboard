/**
 * store/home.ts
 *
 * 웹사이트 내에서 활용 가능한 각종 유틸리티 함수들
 */

import { ref } from "vue"
import { useRouter } from "vue-router"
import { defineStore } from "pinia"

export const useHomeStore = defineStore("home", () => {
  const router = useRouter()
  const drawer = ref<boolean>(true)

  // 첫페이지로 이동
  function main(): void {
    router.push({name: "home"})
  }

  // 사이트 소개 페이지로 이동
  function about(): void {
    router.push({name: "about"})
  }

  // 버그 리포트하러 이동 (Github issues)
  function report(): void {
    router.push({name: "bugReport"})
  }

  // 주어진 아이디에 해당하는 게시판으로 이동
  function board(id: string): void {
    router.push({name: "board", params: { id }})
  }

  // 주어진 아이디에 해당하는 갤러리로 이동
  function gallery(id: string): void {
    router.push({name: "gallery", params: { id }})
  }

  return {
    drawer,
    main,
    about,
    report,
    board,
    gallery,
  }
})