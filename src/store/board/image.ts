/**
 * store/board/editor/image
 *
 * 에디터의 본문 이미지 업로드 / 기존 이미지 불러오기 관련 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../server/index"
import { useAuthStore } from "../user/auth"
import { useUtilStore } from "../util"
import { useHomeStore } from "../home"
import { TEXT } from "../../messages/store/board/editor"
import { Pair } from "../../interface/board"
import { TSBOARD } from "../../../tsboard.config"

export const useEditorImageStore = defineStore("editorImage", () => {
  const server = edenTreaty<App>(process.env.API!)
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const uploadImageDialog = ref<boolean>(false)
  const addImageFromDBDialog = ref<boolean>(false)
  const showRemoveImageInfo = ref<boolean>(false)
  const disableReloadButton = ref<boolean>(false)
  const removeImageTarget = ref<Pair>({ uid: 0, name: "" })
  const boardUid = ref<number>(0)
  const files = ref<File[]>([])
  const uploadingImages = ref<string[]>([])
  const uploadedImages = ref<string[]>([])
  const loadImages = ref<Pair[]>([])
  const lastImageUid = ref<number>(0)
  const totalImageCount = ref<number>(0)
  const bunch = ref<number>(20)
  const limit = ref<number>(TSBOARD.MAX_FILE_SIZE)
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
    files.value = util.attachments(event)
    const response = await server.api.board.uploadimages.post({
      $headers: {
        authorization: auth.user.token,
      },
      boardUid: boardUid.value,
      sizeLimit: TSBOARD.IMAGE.CONTENT_INSERT_SIZE,
      images: files.value,
    })

    if (!response.data) {
      util.snack(TEXT[home.lang].NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.snack(`${TEXT[home.lang].FAILED_UPLOAD_IMAGE} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    uploadedImages.value = response.data.result.uploadedImages
  }

  // 기존에 업로드한 이미지들 가져오기
  async function loadUploadedImages(isAppend: boolean): Promise<void> {
    const response = await server.api.board.loadimages.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        boardUid: boardUid.value,
        lastUid: isAppend ? lastImageUid.value : 0,
        bunch: bunch.value,
      },
    })

    if (!response.data) {
      util.snack(TEXT[home.lang].NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.snack(`${TEXT[home.lang].FAILED_LOAD_IMAGE} (${response.data.error})`)
      return
    }
    if (response.data.result.images.length < 1) {
      util.snack(TEXT[home.lang].EMPTY_IMAGES)
      disableReloadButton.value = true
      return
    }
    if (isAppend) {
      loadImages.value.push(...response.data.result.images)
    } else {
      loadImages.value = response.data.result.images
    }

    totalImageCount.value = response.data.result.totalImageCount
    lastImageUid.value = response.data.result.maxImageUid
    loadImages.value.map((image) => {
      if (lastImageUid.value > image.uid) {
        lastImageUid.value = image.uid
      }
    })
    auth.updateUserToken(response.data.result.newAccessToken)
  }

  // 이미지 삭제하기 준비
  function setRemoveTarget(uid: number, src: string): void {
    showRemoveImageInfo.value = true
    removeImageTarget.value = { uid, name: TSBOARD.PREFIX + src }
  }

  // 이미지 삭제하기 초기화
  function clearRemoveTarget(): void {
    showRemoveImageInfo.value = false
    removeImageTarget.value = { uid: 0, name: "" }
  }

  // 기존에 업로드한 이미지 제거
  async function removeUploadedImage(imageUid: number): Promise<void> {
    const response = await server.api.board.removeimage.delete({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        imageUid,
      },
    })

    if (!response.data) {
      util.snack(TEXT[home.lang].NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.snack(`${TEXT[home.lang].FAILED_REMOVE_IMAGE} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
  }

  return {
    uploadImageDialog,
    addImageFromDBDialog,
    showRemoveImageInfo,
    disableReloadButton,
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
