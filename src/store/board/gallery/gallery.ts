/**
 * store/gallery
 *
 * 갤러리 동작과 관련한 상태 및 함수들
 */

import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../../server/index"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { GridItem } from "../../../interface/gallery"
import { GALLERY } from "../../../messages/store/board/gallery"
import {
  BOARD_CONFIG,
  INIT_POST,
  PAGING_DIRECTION,
  TYPE_MATCH,
} from "../../../../server/database/board/const"
import { BoardConfig, Post } from "../../../interface/board"

export const useGalleryStore = defineStore("gallery", () => {
  const server = edenTreaty<App>(process.env.API!)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const confirmCancelDialog = ref<boolean>(false)
  const id = ref<string>("")
  const config = ref<BoardConfig>(BOARD_CONFIG)
  const post = ref<Post>(INIT_POST)
  const images = ref<GridItem[]>([])
  const cols = ref<number>(3)
  const gridSize = ref<number>(250)
  const page = ref<number>(1)
  const sinceUid = ref<number>(0)
  const pagingDirection = ref<number>(PAGING_DIRECTION.NEXT)
  const option = ref<string>("title")
  const keyword = ref<string>("")

  // 갤러리 사진들 불러오기
  async function loadPhotoList(): Promise<void> {
    id.value = route.params.id as string
    if (id.value.length < 2) {
      util.snack(GALLERY.NO_BOARD_ID)
      return
    }
    const response = await server.api.board.photolist.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: id.value,
        page: page.value,
        pagingDirection: pagingDirection.value,
        sinceUid: sinceUid.value,
        option: option.value,
        keyword: keyword.value,
      },
    })

    if (!response.data) {
      util.snack(GALLERY.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      config.value = response.data.result.config
      util.snack(`${GALLERY.FAILED_LOAD_LIST} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    config.value = response.data.result.config

    if (route.path.includes(TYPE_MATCH[config.value.type].path) === false) {
      util.go(TYPE_MATCH[config.value.type].name)
      return
    }

    images.value = response.data.result.images
  }

  // 다음 페이지 가져오기
  async function loadOldPhotos(): Promise<void> {
    page.value += 1
    pagingDirection.value = PAGING_DIRECTION.NEXT
    sinceUid.value = images.value.at(-1)?.uid ?? 0

    if (images.value.length < config.value.row) {
      util.snack(GALLERY.LAST_PAGE)
      sinceUid.value = 0
      return
    }

    await loadPhotoList()
  }

  // 갤러리 뷰어 다이얼로그 열기
  function open(no: number): void {
    util.go("galleryOpen", id.value, no)
  }

  // 검색 옵션 초기화하기
  function resetSearchKeyword(): void {
    option.value = "title"
    keyword.value = ""
  }

  return {
    id,
    config,
    post,
    confirmCancelDialog,
    images,
    cols,
    gridSize,
    option,
    keyword,
    loadPhotoList,
    loadOldPhotos,
    open,
    resetSearchKeyword,
  }
})