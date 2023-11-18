/**
 * store/gallery.ts
 *
 * 갤러리 동작과 관련한 상태 및 유틸리티 함수들
 */
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { defineStore } from "pinia"
import { GridItem } from "../interface/gallery"
import { useUtilStore } from "./util"
import { useViewerStore } from "./viewer"

export const useGalleryStore = defineStore("gallery", () => {
  const route = useRoute()
  const util = useUtilStore()
  const viewer = useViewerStore()
  const id = ref<string>(route.params?.id.toString())
  const confirmCancelDialog = ref<boolean>(false)
  const images = ref<GridItem[]>([])
  const postUid = ref<number>(0)
  const cols = ref<number>(3)
  const gridSize = ref<number>(250)
  const liked = ref<boolean>(false)

  // 갤러리 뷰어 다이얼로그 열기
  function open(no: number): void {
    util.go("galleryOpen", id.value, no)
    postUid.value = no
    viewer.dialog = true
  }

  // 사진에 대해 좋아요 (혹은 좋아요 해제) 토글하기
  function like(uid: number): void {
    // do something
    liked.value = !liked.value
  }

  return {
    id,
    postUid,
    confirmCancelDialog,
    images,
    cols,
    gridSize,
    liked,
    open,
    like,
  }
})
