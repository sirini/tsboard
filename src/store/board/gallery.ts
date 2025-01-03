import { defineStore } from "pinia"
import { ref } from "vue"
import { NavigationFailure, useRoute } from "vue-router"
import { TSBOARD } from "../../../tsboard.config"
import { TEXT } from "../../messages/store/board/gallery"
import { useHomeStore } from "../home"
import { useAuthStore } from "../user/auth"
import { useUtilStore } from "../util"
import axios from "axios"
import {
  BOARD_ACTION,
  BOARD_CONFIG,
  BoardConfig,
  CONVERT_BOARD_TYPE,
  PAGE,
  Paging,
  SEARCH,
  Search,
} from "../../interface/board_interface"
import { GalleryGridItem, GalleryListResult } from "../../interface/post_interface"
import { CODE, ResponseData } from "../../interface/util_interface"
import { ADMIN } from "../../messages/store/admin/admin"

export const useGalleryStore = defineStore("gallery", () => {
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const confirmCancelDialog = ref<boolean>(false)
  const id = ref<string>("")
  const config = ref<BoardConfig>(BOARD_CONFIG)
  const images = ref<GalleryGridItem[]>([])
  const gridSize = ref<number>(250)
  const page = ref<number>(1)
  const pageLength = ref<number>(1)
  const sinceUid = ref<number>(0)
  const pagingDirection = ref<Paging>(PAGE.NEXT as Paging)
  const option = ref<Search>(SEARCH.TITLE as Search)
  const keyword = ref<string>("")
  const keywordHistories = ref<string[]>([])

  // 갤러리 사진들 불러오기
  async function loadPhotoList(): Promise<NavigationFailure | void | undefined> {
    id.value = route.params.id as string
    if (id.value.length < 2) {
      util.snack(TEXT[home.lang].NO_BOARD_ID)
      return
    }

    const response = await axios.get(`${TSBOARD.API}/board/photo/list`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        id: id.value,
        page: page.value,
        pagingDirection: pagingDirection.value,
        sinceUid: sinceUid.value,
        option: option.value as number,
        keyword: encodeURIComponent(keyword.value),
      },
    })
    const data = response.data as ResponseData<GalleryListResult>
    if (!data || data.success === false) {
      config.value = response.data.result.config
      if (data.code === CODE.INVALID_TOKEN && (await auth.updateAccessToken()) === true) {
        util.error(ADMIN.NEED_REFRESH)
      }
      return util.snack(`${TEXT[home.lang].FAILED_LOAD_LIST} (${data.error})`)
    }
    config.value = data.result.config

    if (route.path.includes(CONVERT_BOARD_TYPE[config.value.type].path) === false) {
      return util.go(CONVERT_BOARD_TYPE[config.value.type].name)
    }

    if (sinceUid.value < 1) {
      images.value = data.result.images
    } else {
      if (response.data.result.images.length > 0) {
        const merged = [
          ...new Map(
            [...images.value, ...data.result.images].map((item) => [item.uid, item]),
          ).values(),
        ]
        images.value = merged
        page.value += 1
      } else {
        util.snack(TEXT[home.lang].LAST_PAGE)
      }
    }
    pageLength.value = Math.ceil(data.result.totalPostCount / config.value.rowCount)
    auth.user.admin =
      data.result.config.admin.group === auth.user.uid ||
      data.result.config.admin.board === auth.user.uid
  }

  // 갤러리 목록 초기화
  async function resetGalleryList(): Promise<void> {
    sinceUid.value = 0
    await loadPhotoList()
    home.setGridLayout()
    gridSize.value = Math.floor(Math.min(config.value.width, home.width) / (12 / home.cols))
    page.value = 1
  }

  // 이전 사진들 가져오기
  async function loadOldPhotos(): Promise<void> {
    pagingDirection.value = PAGE.NEXT as Paging
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
    util.go(util.routerName(config.value.type, BOARD_ACTION.VIEW), id.value, no)
  }

  // 검색 옵션 초기화하기
  function resetSearchKeyword(): void {
    option.value = SEARCH.TITLE as Search
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
