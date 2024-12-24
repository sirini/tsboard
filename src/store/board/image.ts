import { defineStore } from "pinia"
import { ref } from "vue"
import { SIZE, TSBOARD } from "../../../tsboard.config"
import { TEXT } from "../../messages/store/board/editor"
import { useHomeStore } from "../home"
import { useAuthStore } from "../user/auth"
import { useUtilStore } from "../util"
import { useBoardEditorStore } from "./editor"
import axios from "axios"
import { EditorInsertImageResult, Pair } from "../../interface/board_interface"

export const useEditorImageStore = defineStore("editorImage", () => {
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const editor = useBoardEditorStore()
  const uploadImageDialog = ref<boolean>(false)
  const addImageFromDBDialog = ref<boolean>(false)
  const showRemoveImageInfo = ref<boolean>(false)
  const disableReloadButton = ref<boolean>(false)
  const uploading = ref<boolean>(false)
  const removeImageTarget = ref<Pair>({ uid: 0, name: "" })
  const boardUid = ref<number>(0)
  const files = ref<File[]>([])
  const uploadingImages = ref<string[]>([])
  const uploadedImages = ref<string[]>([])
  const loadImages = ref<Pair[]>([])
  const lastImageUid = ref<number>(0)
  const totalImageCount = ref<number>(0)
  const bunch = ref<number>(20)
  const limit = ref<number>(SIZE.MAX_FILE)
  const uploadRule = [
    (value: any) => {
      return (
        !value ||
        !value.length ||
        value[0].size < limit.value ||
        `${TEXT[home.lang].FILESIZE_TOO_LARGE} ${(limit.value / 1024768).toFixed(1)}`
      )
    },
  ]

  // 본문에 삽입할 이미지들 선택 및 업로드
  async function uploadImageFiles(event: MouseEvent): Promise<void> {
    uploading.value = true
    try {
      files.value = editor.getFiles(event)

      const fd = new FormData()
      fd.append("boardUid", boardUid.value.toString())

      for (const file of files.value) {
        fd.append("images", file)
      }

      const response = await axios.post(`${TSBOARD.API}/editor/upload/images`, fd, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      })

      if (!response.data) {
        return util.snack(TEXT[home.lang].NO_RESPONSE)
      }
      if (response.data.success === false) {
        return util.snack(`${TEXT[home.lang].FAILED_UPLOAD_IMAGE} (${response.data.error})`)
      }

      uploadedImages.value = response.data.result as string[]
    } finally {
      uploading.value = false
    }
  }

  // 기존에 업로드한 이미지들 가져오기
  async function loadUploadedImages(isAppend: boolean): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/editor/load/images`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        boardUid: boardUid.value,
        lastUid: isAppend ? lastImageUid.value : 0,
        bunch: bunch.value,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_LOAD_IMAGE} (${response.data.error})`)
    }

    const result = response.data.result as EditorInsertImageResult
    if (result.images.length < 1) {
      util.snack(TEXT[home.lang].EMPTY_IMAGES)
      disableReloadButton.value = true
      return
    }
    if (isAppend) {
      loadImages.value.push(...result.images)
    } else {
      loadImages.value = result.images
    }

    totalImageCount.value = result.totalImageCount
    lastImageUid.value = result.maxImageUid
    loadImages.value.map((image: Pair) => {
      if (lastImageUid.value > image.uid) {
        lastImageUid.value = image.uid
      }
    })
  }

  // 이미지 삭제하기 준비
  function setRemoveTarget(uid: number, src: string): void {
    showRemoveImageInfo.value = true
    removeImageTarget.value = { uid, name: src }
  }

  // 이미지 삭제하기 초기화
  function clearRemoveTarget(): void {
    showRemoveImageInfo.value = false
    removeImageTarget.value = { uid: 0, name: "" }
  }

  // 기존에 업로드한 이미지 제거
  async function removeUploadedImage(imageUid: number): Promise<void> {
    const response = await axios.delete(`${TSBOARD.API}/editor/remove/image`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        imageUid,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_REMOVE_IMAGE} (${response.data.error})`)
    }

    util.snack(TEXT[home.lang].REMOVED_IMAGE)
  }

  return {
    uploadImageDialog,
    addImageFromDBDialog,
    showRemoveImageInfo,
    disableReloadButton,
    uploading,
    removeImageTarget,
    boardUid,
    files,
    uploadingImages,
    uploadedImages,
    loadImages,
    lastImageUid,
    totalImageCount,
    bunch,
    uploadRule,
    loadUploadedImages,
    uploadImageFiles,
    setRemoveTarget,
    clearRemoveTarget,
    removeUploadedImage,
  }
})
