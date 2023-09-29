/**
 * store/board.ts
 *
 * 게시판 동작과 관련한 상태 및 유틸리티 함수들
 */
import { useRouter } from "vue-router"
import { defineStore } from "pinia"

export const useBoardStore = defineStore("board", () => {
  const router = useRouter()

  // 게시글 보러가기
  function goListPage(id: string): void {
    router.push({ name: "list", params: { id } })
  }

  // 게시글 보러가기
  function goViewPage(id: string, no: number): void {
    router.push({ name: "view", params: { id, no } })
  }

  // 글작성 페이지로 가기
  function goWritePage(id: string): void {
    router.push({ name: "write", params: { id } })
  }

  return { goListPage, goViewPage, goWritePage }
})
