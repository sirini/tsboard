import { defineStore } from "pinia"
import { ref } from "vue"
import { NavigationFailure, useRoute, useRouter } from "vue-router"
import * as COMMENT from "../../../messages/store/board/comment"
import { TEXT } from "../../../messages/store/board/gallery"
import { useHomeStore } from "../../home"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { useBoardViewStore } from "../view"
import { PhotoItem, Position } from "../../../interface/post_interface"
import {
  BOARD_ACTION,
  BOARD_CONFIG,
  BOARD_LIST_ITEM,
  BoardConfig,
  BoardListItem,
  BoardViewResult,
  CONVERT_BOARD_TYPE,
  PAGE,
  Paging,
  Pair,
} from "../../../interface/board_interface"
import { CommentListResult, CommentResult } from "../../../interface/comment_interface"
import axios from "axios"
import { TSBOARD } from "../../../../tsboard.config"

export const useViewerStore = defineStore("viewer", () => {
  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()
  const view = useBoardViewStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const dialog = ref<boolean>(false)
  const isDragging = ref<boolean>(false)
  const startPos = ref<Position>({ x: 0, y: 0 })
  const transPos = ref<Position>({ x: 0, y: 0 })
  const scale = ref<number>(1.0)
  const drawerWidth = ref<number>(300)
  const drawerPosition = ref<"left" | "right" | "bottom">("left")
  const targetDom = "#tsboardViewerPreview"
  const zoomSpeed = 0.25
  const zoomMax = 20.0
  const zoomMin = 0.5
  const id = ref<string>("")
  const config = ref<BoardConfig>(BOARD_CONFIG)
  const postUid = ref<number>(0)
  const sinceUid = ref<number>(0)
  const post = ref<BoardListItem>(BOARD_LIST_ITEM)
  const images = ref<PhotoItem[]>([])
  const tags = ref<Pair[]>([])
  const comments = ref<CommentResult[]>([])
  const page = ref<number>(1)
  const pagingDirection = ref<Paging>(PAGE.NEXT as Paging)
  const prevPostUid = ref<number>(0)
  const nextPostUid = ref<number>(0)
  const bunch = ref<number>(100)
  const position = ref<number>(0)
  const mobileColor = ref<string>("grey-darken-4")
  const isViewContent = ref<boolean>(false)
  const latestLimit = 5
  const textRule = [
    (value: any) => {
      if (value.length > 2) return true
      return "3글자 이상 입력해 주세요"
    },
  ]

  // 게시글 불러오기
  async function loadPost(): Promise<NavigationFailure | void | undefined> {
    id.value = route.params.id as string
    postUid.value = parseInt(route.params.no as string)

    if (id.value.length < 2) {
      return util.snack(TEXT[home.lang].NO_BOARD_ID)
    }

    let needUpdateHit = 0
    if (view.isAlreadyRead(postUid.value) === false) {
      view.markAsRead(postUid.value)
      needUpdateHit = 1
    }

    const response = await axios.get(`${TSBOARD.API}/board/view`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        id: id.value,
        postUid: postUid.value,
        needUpdateHit,
        latestLimit,
      },
    })

    if (!response.data) {
      util.snack(TEXT[home.lang].NO_RESPONSE)
      return close()
    }
    if (response.data.success === false) {
      config.value = response.data.result.config
      util.snack(`${TEXT[home.lang].FAILED_LOAD_PHOTO} (${response.data.error})`)
      return close()
    }

    config.value = response.data.result.config

    if (route.path.includes(CONVERT_BOARD_TYPE[config.value.type].path) === false) {
      return util.go(CONVERT_BOARD_TYPE[config.value.type].name)
    }

    const result = response.data.result as BoardViewResult
    post.value = result.post
    tags.value = result.tags
    position.value = 0
    prevPostUid.value = result.prevPostUid
    nextPostUid.value = result.nextPostUid
  }

  // 사진들 불러오기
  async function loadPhotos(): Promise<void> {
    id.value = route.params.id as string
    if (id.value.length < 2) {
      return util.snack(TEXT[home.lang].NO_BOARD_ID)
    }

    const response = await axios.get(`${TSBOARD.API}/board/photo/view`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        id: id.value,
        no: postUid.value,
      },
    })

    if (!response.data) {
      util.snack(TEXT[home.lang].NO_RESPONSE)
      return close()
    }
    if (response.data.success === false) {
      config.value = response.data.result.config
      util.snack(`${TEXT[home.lang].FAILED_LOAD_PHOTO} (${response.data.error})`)
      return close()
    }

    images.value = response.data.result.images
  }

  // 댓글 불러오기
  async function loadComments(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/comment/list`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        id: id.value,
        postUid: postUid.value,
        page: page.value,
        pagingDirection: pagingDirection.value,
        bunch: bunch.value,
        sinceUid: sinceUid.value,
      },
    })

    if (!response.data) {
      return util.snack(COMMENT.TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${COMMENT.TEXT[home.lang].FAILED_LOAD_COMMENT} (${response.data.error})`)
    }
    const result = response.data.result as CommentListResult
    comments.value = result.comments
  }

  // 사진에 좋아요 추가 (혹은 취소) 하기
  async function like(isLike: boolean): Promise<void> {
    const response = await axios.patch(
      `${TSBOARD.API}/board/like`,
      {
        boardUid: config.value.uid,
        postUid: postUid.value,
        liked: isLike ? 1 : 0,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      },
    )

    if (response.data && response.data.success === true) {
      post.value.liked = isLike
      if (isLike) {
        post.value.like += 1
      } else {
        post.value.like -= 1
      }
    }
  }

  // 사진을 클릭할 때
  function mouseDown(event: MouseEvent): void {
    const target = document.querySelector(targetDom) as HTMLElement
    isDragging.value = true
    startPos.value.x = event.clientX - transPos.value.x
    startPos.value.y = event.clientY - transPos.value.y

    target.ondragstart = function () {
      return false // 브라우저 기본 드래깅 방지
    }
  }

  // 사진 위치 움직이기
  function mouseMove(event: MouseEvent): void {
    if (isDragging.value === false) {
      return
    }
    const target = document.querySelector(targetDom) as HTMLElement
    transPos.value.x = event.clientX - startPos.value.x
    transPos.value.y = event.clientY - startPos.value.y
    target.style.transform = `translate(${transPos.value.x}px, ${transPos.value.y}px) scale(${scale.value})`
  }

  // 사진에서 마우스 클릭이 끝났을 때
  function mouseUp(event: MouseEvent): void {
    isDragging.value = false
  }

  // 사진 스케일 조정
  function adjustImageScale(): void {
    const target = document.querySelector(targetDom) as HTMLElement
    scale.value = Math.min(zoomMax, Math.max(scale.value, zoomMin))
    target.style.transform = `translate(${transPos.value.x}px, ${transPos.value.y}px) scale(${scale.value})`
  }

  // 마우스 휠로 확대/축소
  function mouseWheel(event: WheelEvent): void {
    event.preventDefault()
    const target = document.querySelector(targetDom) as HTMLElement
    if (event.deltaY > 0) {
      scale.value -= zoomSpeed
    } else {
      scale.value += zoomSpeed
    }
    adjustImageScale()
  }

  // 사진 확대하기
  function zoomIn(): void {
    scale.value += 1
    adjustImageScale()
  }

  // 사진 축소하기
  function zoomOut(): void {
    scale.value -= 1
    adjustImageScale()
  }

  // 사진에서 마우스가 떠날 때
  function mouseLeave(event: MouseEvent): void {
    isDragging.value = false
  }

  // 사진 위치/크기 초기화
  function reset(): void {
    scale.value = 1.0
    startPos.value = { x: 0, y: 0 }
    transPos.value = { x: 0, y: 0 }

    const target = document.querySelector(targetDom) as HTMLElement
    target.style.transform = `translate(0px, 0px) scale(1.0)`
  }

  // 이전 사진 보기
  function prev(): void {
    if (images.value.length === 1) {
      return util.snack("사진이 한 장만 있습니다")
    }
    if (position.value === 0) {
      return util.snack("첫번째 사진입니다")
    }
    position.value -= 1
  }

  // 다음 사진 보기
  function next(): void {
    if (images.value.length === 1) {
      return util.snack("사진이 한 장만 있습니다")
    }
    if (position.value + 1 === images.value.length) {
      return util.snack("마지막 사진입니다")
    }
    position.value += 1
  }

  // 이미지 뷰어 다이얼로그 닫기
  function close(): void {
    dialog.value = false
    postUid.value = 0
    router.push({
      name: util.routerName(config.value.type, BOARD_ACTION.LIST),
      params: { id: id.value },
    })
  }

  return {
    id,
    dialog,
    drawerWidth,
    drawerPosition,
    config,
    sinceUid,
    postUid,
    post,
    prevPostUid,
    nextPostUid,
    comments,
    images,
    tags,
    position,
    mobileColor,
    isViewContent,
    textRule,
    loadPost,
    loadPhotos,
    loadComments,
    like,
    mouseDown,
    mouseMove,
    mouseUp,
    mouseWheel,
    mouseLeave,
    zoomIn,
    zoomOut,
    reset,
    prev,
    next,
    close,
  }
})
