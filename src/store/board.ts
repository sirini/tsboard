/**
 * store/board.ts
 *
 * 게시판 동작과 관련한 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { Pair } from "../interface/board"

export const useBoardStore = defineStore("board", () => {
  const route = useRoute()
  const id = ref<string>(route.params?.id.toString())
  const uid = ref<number>(0)
  const uploadImageDialog = ref<boolean>(false)
  const addImageFromDBDialog = ref<boolean>(false)
  const addImageURLDialog = ref<boolean>(false)
  const addVideoURLDialog = ref<boolean>(false)
  const addTableDialog = ref<boolean>(false)
  const confirmCancelDialog = ref<boolean>(false)
  const width = ref<number>(1200)
  const categories = ref<Pair[]>([
    { uid: 1, name: "news" },
    { uid: 2, name: "test" },
    { uid: 3, name: "sample" },
  ])

  return {
    id,
    uid,
    uploadImageDialog,
    addImageFromDBDialog,
    addImageURLDialog,
    addVideoURLDialog,
    addTableDialog,
    confirmCancelDialog,
    width,
    categories,
  }
})
