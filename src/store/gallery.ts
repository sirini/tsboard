/**
 * store/gallery.ts
 * 
 * 갤러리 동작과 관련한 상태 및 유틸리티 함수들
 */
import { ref } from "vue"
import { useRouter } from "vue-router"
import { defineStore } from "pinia"

export const useGalleryStore = defineStore("gallery", () => {
  const router = useRouter()
  const viewerDialog = ref<boolean>(false)
  const confirmCancelDialog = ref<boolean>(false)
  const images = ref<string[]>([])
  const videos = ref<string[]>([])
  const postUid = ref<number>(0)
  const position = ref<number>(0)
  const width = ref<number>(1200)
  const cols = ref<number>(3)
  const gridGap = ref<number>(15)
  const gridSize = ref<number>((width.value / (12 / cols.value)) - gridGap.value)

  // 사진 목록 보러가기
  function list(id: string): void {
    router.push({ name: "gallery", params: { id } })
  }

  // 갤러리 뷰어 다이얼로그 열기
  function open(id: string, no: number): void {
    router.push({name: "galleryOpen", params: {id, no,}})
    postUid.value = no
    viewerDialog.value = true
  }

  // 사진 업로드 페이지로 이동하기
  function upload(id: string): void {
    router.push({name: "galleryUpload", params: { id }})
  }

  // 갤러리 관리 페이지로 이동하기
  function admin(id: string): void {
    router.push({name: "adminGalleryManager", params: { id }})
  }

  // 사진들 저장하기
  async function save(subject: string, content: string, files: File[]): Promise<boolean> {
    const result = false
    // do something
    return result
  }

  return {
    postUid,
    viewerDialog,
    confirmCancelDialog,
    images,
    videos,
    position,
    width,
    cols,
    gridSize,
    list,
    open,
    upload,
    admin,
    save,
  }
})