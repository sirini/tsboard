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
import { useViewerStore } from "./viewer"
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
  const viewer = useViewerStore()
  const confirmCancelDialog = ref<boolean>(false)
  const id = ref<string>("")
  const config = ref<BoardConfig>(BOARD_CONFIG)
  const post = ref<Post>(INIT_POST)
  const images = ref<GridItem[]>([])
  const postUid = ref<number>(0)
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

    await loadPhotoList()
    if (images.value.length < config.value.row) {
      util.snack(GALLERY.LAST_PAGE)
    }
  }

  // 사진에 좋아요 추가 (혹은 취소) 하기
  async function like(isLike: boolean): Promise<void> {
    const response = await server.api.board.likepost.patch({
      $headers: {
        authorization: auth.user.token,
      },
      boardUid: config.value.uid,
      postUid: postUid.value,
      liked: isLike ? 1 : 0,
    })

    if (response.data && response.data.success === true) {
      post.value.liked = isLike
      if (isLike) {
        post.value.like += 1
      } else {
        post.value.like -= 1
      }
    }
  }

  // 갤러리 뷰어 다이얼로그 열기
  function open(no: number): void {
    util.go("galleryOpen", id.value, no)
    postUid.value = no
    viewer.dialog = true
  }

  // 검색 옵션 초기화하기
  function resetSearchKeyword(): void {
    option.value = "title"
    keyword.value = ""
  }

  // 이미지 미리보기 크기를 컨테이너에 맞춰서 조정해주기
  function setGalleryItemWidth(): void {
    const div = document.querySelector<HTMLDivElement>("#galleryContainer")
    if (!div) {
      return
    }
    const rect = div.getBoundingClientRect()
    gridSize.value = rect.width / (12 / cols.value)
  }

  return {
    id,
    config,
    post,
    postUid,
    confirmCancelDialog,
    images,
    cols,
    gridSize,
    option,
    keyword,
    loadPhotoList,
    loadOldPhotos,
    like,
    open,
    resetSearchKeyword,
    setGalleryItemWidth,
  }
})
