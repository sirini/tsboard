/**
 * store/board.ts
 *
 * 게시판 동작과 관련한 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { useRouter } from "vue-router"
import { defineStore } from "pinia"
import { Pair } from "../interface/board"

export const useBoardStore = defineStore("board", () => {
  const router = useRouter()
  const uploadImageDialog = ref<boolean>(false)
  const addImageFromDBDialog = ref<boolean>(false)
  const addImageURLDialog = ref<boolean>(false)
  const addVideoURLDialog = ref<boolean>(false)
  const addTableDialog = ref<boolean>(false)
  const confirmCancelDialog = ref<boolean>(false)
  const confirmRemoveCommentDialog = ref<boolean>(false)
  const width = ref<number>(1200)
  const categories = ref<Pair[]>([
    { uid: 1, name: "news" },
    { uid: 2, name: "test" },
    { uid: 3, name: "sample" },
  ])

  // 게시글 목록 보러가기
  function list(id: string): void {
    router.push({ name: "board", params: { id } })
  }

  // 게시글 보러가기
  function view(id: string, no: number): void {
    router.push({ name: "boardView", params: { id, no } })
  }

  // 글작성 페이지로 가기
  function write(id: string): void {
    router.push({ name: "boardWrite", params: { id } })
  }

  // 게시판 관리 페이지로 가기
  function admin(id: string): void {
    router.push({ name: "adminBoardManager", params: { id } })
  }

  return {
    uploadImageDialog,
    addImageFromDBDialog,
    addImageURLDialog,
    addVideoURLDialog,
    addTableDialog,
    confirmCancelDialog,
    confirmRemoveCommentDialog,
    width,
    categories,
    list,
    view,
    write,
    admin,
  }
})
