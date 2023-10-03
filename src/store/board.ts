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
  const confirmCancelDialog = ref<boolean>(false)
  const confirmRemoveCommentDialog = ref<boolean>(false)
  const snackbar = ref<boolean>(false)
  const snackbarTimeout = ref<number>(3000)
  const snackbarText = ref<string>("")
  const router = useRouter()

  // 게시글 목록 보러가기
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

  // 글작성 시 이미지 업로드하고 본문에 추가하기
  function uploadImages(editor: any): void {
    const url = `https://images.unsplash.com/photo-1695653422909-20d8cc35ca2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=317&q=80`

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return {
    uploadImageDialog, confirmCancelDialog, confirmRemoveCommentDialog,
    snackbar, snackbarTimeout, snackbarText,
    goListPage, goViewPage, goWritePage, uploadImages
  }
})
