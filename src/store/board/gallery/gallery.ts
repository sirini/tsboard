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
import { BoardConfig, Post, SEARCH_OPTION, SearchOption } from "../../../interface/board"

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
  const gridSize = ref<number>(250)
  const page = ref<number>(1)
  const pageLength = ref<number>(1)
  const sinceUid = ref<number>(0)
  const pagingDirection = ref<number>(PAGING_DIRECTION.NEXT)
  const option = ref<SearchOption>(SEARCH_OPTION.TITLE as SearchOption)
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
        option: option.value as number,
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

    if (sinceUid.value < 1) {
      images.value = response.data.result.images
    } else {
      if (response.data.result.images.length > 0) {
        images.value.push(...response.data.result.images)
        page.value += 1
      } else {
        util.snack(GALLERY.LAST_PAGE)
      }
    }
    pageLength.value = Math.ceil(response.data.result.totalPostCount / config.value.row)
  }

  // 이전 사진들 가져오기
  async function loadOldPhotos(): Promise<void> {
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
    option.value = SEARCH_OPTION.TITLE as SearchOption
    keyword.value = ""
  }

  // 목록보기 변수 초기화
  function clearVariables(): void {
    sinceUid.value = 0
    page.value = 1
    pageLength.value = 1
  }

  // 검색하기
  function search(): void {
    if (keyword.value.length < 2) {
      return
    }
    clearVariables()
    loadPhotoList()
  }

  // 갤러리 목록보기
  function list(): void {
    clearVariables()
    resetSearchKeyword()
    loadPhotoList()
  }

  return {
    id,
    config,
    post,
    confirmCancelDialog,
    images,
    gridSize,
    page,
    pageLength,
    option,
    keyword,
    loadPhotoList,
    loadOldPhotos,
    open,
    resetSearchKeyword,
    search,
    list,
  }
})
