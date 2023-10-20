/**
 * store/board.ts
 *
 * 게시판 동작과 관련한 상태 및 유틸리티 함수들
 */
import { ref } from "vue"
import { useRouter } from "vue-router"
import { defineStore } from "pinia"

export const useBoardStore = defineStore("board", () => {
  const uploadImageDialog = ref<boolean>(false)
  const addImageFromDBDialog = ref<boolean>(false)
  const addImageURLDialog = ref<boolean>(false)
  const addVideoURLDialog = ref<boolean>(false)
  const addTableDialog = ref<boolean>(false)
  const confirmCancelDialog = ref<boolean>(false)
  const confirmRemoveCommentDialog = ref<boolean>(false)
  const snackbar = ref<boolean>(false)
  const snackbarTimeout = ref<number>(3000)
  const snackbarText = ref<string>("")
  const router = useRouter()

  // 게시글 목록 보러가기
  function goListPage(id: string): void {
    router.push({ name: "board", params: { id } })
  }

  // 게시글 보러가기
  function goViewPage(id: string, no: number): void {
    router.push({ name: "boardView", params: { id, no } })
  }

  // 글작성 페이지로 가기
  function goWritePage(id: string): void {
    router.push({ name: "boardWrite", params: { id } })
  }

  return {
    uploadImageDialog,
    addImageFromDBDialog,
    addImageURLDialog,
    addVideoURLDialog,
    addTableDialog,
    confirmCancelDialog,
    confirmRemoveCommentDialog,
    snackbar,
    snackbarTimeout,
    snackbarText,
    goListPage,
    goViewPage,
    goWritePage,
  }
})
