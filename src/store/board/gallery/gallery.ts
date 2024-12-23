/**
 * store/gallery
 *
 * 갤러리 동작과 관련한 상태 및 함수들
 */

import { edenTreaty } from "@elysiajs/eden"
import { defineStore } from "pinia"
import { ref } from "vue"
import { NavigationFailure, useRoute } from "vue-router"
import {
  ACTION_TARGET,
  BOARD_CONFIG,
  INIT_POST,
  PAGING_DIRECTION,
  SEARCH_OPTION,
  TYPE_MATCH,
} from "../../../../server/database/board/const"
import type { App } from "../../../../server/index"
import { TSBOARD } from "../../../../tsboard.config"
import { BoardConfig, Post, SearchOption } from "../../../interface/board"
import { GridItem } from "../../../interface/gallery"
import { TEXT } from "../../../messages/store/board/gallery"
import { useHomeStore } from "../../home"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"

export const useGalleryStore = defineStore("gallery", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
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
  const keywordHistories = ref<string[]>([])

  // 갤러리 사진들 불러오기
  async function loadPhotoList(): Promise<NavigationFailure | void | undefined> {
    id.value = route.params.id as string
    if (id.value.length < 2) {
      util.snack(TEXT[home.lang].NO_BOARD_ID)
      return
    }

    const response = await client.tsapi.board.photo.list.get({
      $headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      $query: {
        id: id.value,
        page: page.value,
        pagingDirection: pagingDirection.value,
        sinceUid: sinceUid.value,
        option: option.value as number,
        keyword: keyword.value,
        userUid: auth.user.uid,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      config.value = response.data.result.config
      return util.snack(`${TEXT[home.lang].FAILED_LOAD_LIST} (${response.data.error})`)
    }

    config.value = response.data.result.config

    if (route.path.includes(TYPE_MATCH[config.value.type].path) === false) {
      return util.go(TYPE_MATCH[config.value.type].name)
    }

    if (sinceUid.value < 1) {
      images.value = response.data.result.images
    } else {
      if (response.data.result.images.length > 0) {
        images.value.push(...response.data.result.images)
        page.value += 1
      } else {
        util.snack(TEXT[home.lang].LAST_PAGE)
      }
    }
    pageLength.value = Math.ceil(response.data.result.totalPostCount / config.value.rowCount)

    auth.user.admin =
      response.data.result.config.admin.group === auth.user.uid ||
      response.data.result.config.admin.board === auth.user.uid
  }

  // 갤러리 목록 초기화
  async function resetGalleryList(): Promise<void> {
    sinceUid.value = 0
    page.value = 1
    await loadPhotoList()
    home.setGridLayout()
    gridSize.value = Math.floor(Math.min(config.value.width, home.width) / (12 / home.cols))
  }

  // 이전 사진들 가져오기
  async function loadOldPhotos(): Promise<void> {
    pagingDirection.value = PAGING_DIRECTION.NEXT
    sinceUid.value = images.value.at(-1)?.uid ?? 0

    if (images.value.length < config.value.rowCount) {
      util.snack(TEXT[home.lang].LAST_PAGE)
      sinceUid.value = 0
      return
    }

    await loadPhotoList()
  }

  // 갤러리 뷰어 다이얼로그 열기
  function open(no: number): void {
    util.go(util.routerName(config.value.type, ACTION_TARGET.VIEW), id.value, no)
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

  // 검색어 확정하고 검색어 히스토리에 추가
  function enterSearchKeyword(): void {
    if (keyword.value.length < 2) {
      return
    }
    clearVariables()
    loadPhotoList()
    keywordHistories.value.push(keyword.value)
    if (keywordHistories.value.length > 10) {
      keywordHistories.value.splice(0, 1)
    }
  }

  // 검색어 히스토리에서 이전 검색어 클릭 시 업데이트
  function selectKeywordFromHistory(selectedKeyword: string): void {
    if (keyword.value.length < 2) {
      return
    }
    keyword.value = selectedKeyword
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
    sinceUid,
    page,
    pageLength,
    option,
    keyword,
    keywordHistories,
    loadPhotoList,
    resetGalleryList,
    loadOldPhotos,
    open,
    resetSearchKeyword,
    enterSearchKeyword,
    selectKeywordFromHistory,
    list,
  }
})
