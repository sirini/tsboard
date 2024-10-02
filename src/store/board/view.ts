/**
 * store/board/view
 *
 * 게시글 보기 및 댓글 보기와 관련한 상태 및 함수들
 */

import { edenTreaty } from "@elysiajs/eden"
import { defineStore } from "pinia"
import { ref } from "vue"
import { NavigationFailure, useRoute } from "vue-router"
import {
  ACTION_TARGET,
  BOARD_CONFIG,
  INIT_POST_VIEW,
  READ_POST_KEY,
  TYPE_MATCH,
} from "../../../server/database/board/const"
import type { App } from "../../../server/index"
import { TSBOARD } from "../../../tsboard.config"
import {
  BoardConfig,
  BoardListItem,
  Pair,
  PhotoItem,
  PostFile,
  PostView,
  WriterLatestComment,
  WriterLatestPost,
} from "../../interface/board"
import { TEXT } from "../../messages/store/board/view"
import { useHomeStore } from "../home"
import { useAuthStore } from "../user/auth"
import { useUtilStore } from "../util"

export const useBoardViewStore = defineStore("boardView", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const confirmRemovePostDialog = ref<boolean>(false)
  const previewDialog = ref<boolean>(false)
  const movePostDialog = ref<boolean>(false)
  const id = ref<string>("")
  const boardListItems = ref<BoardListItem[]>([])
  const moveTarget = ref<BoardListItem>({ uid: 0, name: "", info: "" })
  const postUid = ref<number>(0)
  const prevPostUid = ref<number>(0)
  const nextPostUid = ref<number>(0)
  const config = ref<BoardConfig>(BOARD_CONFIG)
  const post = ref<PostView>(INIT_POST_VIEW)
  const files = ref<PostFile[]>([])
  const images = ref<PhotoItem[]>([])
  const tags = ref<Pair[]>([])
  const previewPath = ref<string>("")
  const scrollY = ref<number>(0)
  const innerHeight = ref<number>(0)
  const scrollHeight = ref<number>(0)
  const latestLimit = 5
  const writerPosts = ref<WriterLatestPost[]>([])
  const writerComments = ref<WriterLatestComment[]>([])

  async function loadPostView(): Promise<NavigationFailure | void | undefined> {
    id.value = route.params.id as string
    postUid.value = parseInt(route.params.no as string)

    if (id.value.length < 2) {
      return util.snack(TEXT[home.lang].NO_BOARD_ID)
    }

    let needUpdateHit = 0
    if (isAlreadyRead(postUid.value) === false) {
      markAsRead(postUid.value)
      needUpdateHit = 1
    }

    const response = await client.tsapi.board.view.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: id.value,
        postUid: postUid.value,
        needUpdateHit,
        userUid: auth.user.uid,
        latestLimit,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      config.value = response.data.result.config
      post.value = INIT_POST_VIEW
      post.value.title = TEXT[home.lang].FAILED_TITLE
      post.value.content = TEXT[home.lang].FAILED_CONTENT
      files.value = []
      images.value = []
      prevPostUid.value = 0
      nextPostUid.value = 0
      return util.snack(`${TEXT[home.lang].FAILED_LOAD_POST} (${response.data.error})`)
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    config.value = response.data.result.config

    if (route.path.includes(TYPE_MATCH[config.value.type].path) === false) {
      return util.go(TYPE_MATCH[config.value.type].name)
    }
    post.value = response.data.result.post
    tags.value = response.data.result.tags
    files.value = response.data.result.files
    images.value = response.data.result.images
    prevPostUid.value = response.data.result.prevPostUid
    nextPostUid.value = response.data.result.nextPostUid
    writerPosts.value = response.data.result.writerPosts
    writerComments.value = response.data.result.writerComments

    auth.user.admin =
      response.data.result.config.admin.group === auth.user.uid ||
      response.data.result.config.admin.board === auth.user.uid
  }

  // 게시글에 좋아요 추가 (혹은 취소) 하기
  async function like(isLike: boolean): Promise<void> {
    const response = await client.tsapi.board.like.post.patch({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        userUid: auth.user.uid,
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

  // 첨부파일 다운로드하기
  async function download(fileUid: number): Promise<void> {
    const response = await client.tsapi.board.download.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        boardUid: config.value.uid,
        fileUid,
        userUid: auth.user.uid,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_DOWNLOAD} (${response.data.error})`)
    }

    const link = document.createElement("a")
    link.href = `${TSBOARD.API.URI}/${response.data.result.path}`
    link.download = response.data.result.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    util.snack(TEXT[home.lang].DOWNLOADED_FILE)
  }

  // 게시글을 삭제할지 확인하는 다이얼로그 띄우기
  function openConfirmRemoveDialog(): void {
    confirmRemovePostDialog.value = true
  }

  // 삭제 여부 확인하는 다이얼로그 닫기
  function closeConfirmRemoveDialog(): void {
    confirmRemovePostDialog.value = false
  }

  // 이미지 첨부파일의 썸네일 클릭 시 미리보기 열기
  function openPreviewDialog(path: string): void {
    previewPath.value = path
    previewDialog.value = true
  }

  // 이미지 첨부파일 미리보기 창 닫기
  function closePreviewDialog(): void {
    previewPath.value = ""
    previewDialog.value = false
  }

  // 게시글 이동/복사 다이얼로그 열기
  async function openMoveDialog(): Promise<void> {
    const response = await client.tsapi.board.move.list.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        boardUid: config.value.uid,
        userUid: auth.user.uid,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_LOAD_BOARD_LISTS} (${response.data.error})`)
    }

    boardListItems.value = response.data.result.boards
    movePostDialog.value = true
  }

  // 게시글 이동/복사 다이얼로그 닫기
  function closeMoveDialog(): void {
    movePostDialog.value = false
  }

  // 게시글 삭제하기
  async function removePost(): Promise<void> {
    if (postUid.value < 1) {
      return
    }
    const response = await client.tsapi.board.remove.post.delete({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        boardUid: config.value.uid,
        postUid: postUid.value,
        userUid: auth.user.uid,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_REMOVE_POST} (${response.data.error})`)
    }

    auth.updateUserToken(response.data.result.newAccessToken)
    util.snack(TEXT[home.lang].REMOVED_POST)
    closeConfirmRemoveDialog()

    util.go(util.routerName(config.value.type, ACTION_TARGET.LIST), id.value)
  }

  // 게시글을 이미 읽었는지 확인하기
  function isAlreadyRead(postUid: number): boolean {
    const readPosts = window.localStorage.getItem(READ_POST_KEY)
    if (readPosts) {
      const postUids = JSON.parse(readPosts) as number[]
      return postUids.includes(postUid)
    }
    return false
  }

  // 게시글 읽음으로 체크하기
  function markAsRead(postUid: number): void {
    const readPosts = window.localStorage.getItem(READ_POST_KEY)
    let postUids: number[] = []
    if (readPosts) {
      postUids = JSON.parse(readPosts) as number[]
    }
    postUids.push(postUid)
    window.localStorage.setItem(READ_POST_KEY, JSON.stringify(postUids))
  }

  // 이동할 게시판 선택
  function selectMoveTarget(target: BoardListItem): void {
    moveTarget.value = target
  }

  // 이동 적용
  async function applyMovePost(): Promise<void> {
    const response = await client.tsapi.board.move.apply.put({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        boardUid: config.value.uid,
        targetBoardUid: moveTarget.value.uid,
        userUid: auth.user.uid,
        postUid: postUid.value,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_MOVE_POST} (${response.data.error})`)
    }

    util.snack(TEXT[home.lang].MOVE_DONE)
    closeMoveDialog()
    util.go(config.value.type, id.value)
  }

  // 현재 스크롤 위치 업데이트하기
  function updateScrollY(): void {
    scrollY.value = window.scrollY
    innerHeight.value = window.innerHeight
    scrollHeight.value = document.body.scrollHeight
  }

  // 페이지 상단으로 스크롤
  function scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // 페이지 하단으로 스크롤
  function scrollToBottom(): void {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    })
  }

  // 글보기 준비
  function prepareViewPost(): void {
    loadPostView()
    home.setGridLayout()
    window.addEventListener("scroll", updateScrollY)
  }

  return {
    confirmRemovePostDialog,
    previewDialog,
    movePostDialog,
    id,
    boardListItems,
    moveTarget,
    postUid,
    prevPostUid,
    nextPostUid,
    config,
    post,
    files,
    images,
    tags,
    previewPath,
    scrollY,
    innerHeight,
    scrollHeight,
    writerPosts,
    writerComments,
    loadPostView,
    like,
    download,
    openConfirmRemoveDialog,
    closeConfirmRemoveDialog,
    openPreviewDialog,
    closePreviewDialog,
    openMoveDialog,
    closeMoveDialog,
    removePost,
    isAlreadyRead,
    markAsRead,
    selectMoveTarget,
    applyMovePost,
    updateScrollY,
    scrollToTop,
    scrollToBottom,
    prepareViewPost,
  }
})
