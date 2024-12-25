import { defineStore } from "pinia"
import { ref } from "vue"
import { NavigationFailure, useRoute } from "vue-router"
import { TSBOARD } from "../../../tsboard.config"
import { TEXT } from "../../messages/store/board/view"
import { useHomeStore } from "../home"
import { useAuthStore } from "../user/auth"
import { useUtilStore } from "../util"
import {
  BOARD_ACTION,
  BOARD_CONFIG,
  BOARD_LIST_ITEM,
  BoardAttachedImage,
  BoardAttachment,
  BoardConfig,
  BoardItem,
  BoardListItem,
  BoardViewDownloadResult,
  BoardViewResult,
  BoardWriterLatestComment,
  BoardWriterLatestPost,
  CONVERT_BOARD_TYPE,
  Pair,
} from "../../interface/board_interface"
import axios from "axios"
import { READ_POST_KEY } from "../../interface/post_interface"

export const useBoardViewStore = defineStore("boardView", () => {
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const loading = ref<boolean>(false)
  const confirmRemovePostDialog = ref<boolean>(false)
  const previewDialog = ref<boolean>(false)
  const movePostDialog = ref<boolean>(false)
  const id = ref<string>("")
  const boardListItems = ref<BoardItem[]>([])
  const moveTarget = ref<BoardItem>({ uid: 0, name: "", info: "" })
  const postUid = ref<number>(0)
  const prevPostUid = ref<number>(0)
  const nextPostUid = ref<number>(0)
  const config = ref<BoardConfig>(BOARD_CONFIG)
  const post = ref<BoardListItem>(BOARD_LIST_ITEM)
  const files = ref<BoardAttachment[]>([])
  const images = ref<BoardAttachedImage[]>([])
  const tags = ref<Pair[]>([])
  const previewPath = ref<string>("")
  const scrollY = ref<number>(0)
  const innerHeight = ref<number>(0)
  const scrollHeight = ref<number>(0)
  const latestLimit = 5
  const writerPosts = ref<BoardWriterLatestPost[]>([])
  const writerComments = ref<BoardWriterLatestComment[]>([])

  // 게시글 불러오기
  async function loadPostView(): Promise<NavigationFailure | void | undefined> {
    loading.value = true
    try {
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
        return util.snack(TEXT[home.lang].NO_RESPONSE)
      }
      if (response.data.success === false) {
        config.value = response.data.result.config
        post.value = BOARD_LIST_ITEM
        post.value.title = TEXT[home.lang].FAILED_TITLE
        post.value.content = TEXT[home.lang].FAILED_CONTENT
        files.value = [] as BoardAttachment[]
        images.value = [] as BoardAttachedImage[]
        prevPostUid.value = 0
        nextPostUid.value = 0
        return util.snack(`${TEXT[home.lang].FAILED_LOAD_POST} (${response.data.error})`)
      }

      const result = response.data.result as BoardViewResult
      config.value = result.config

      if (route.path.includes(CONVERT_BOARD_TYPE[config.value.type].path) === false) {
        return util.go(CONVERT_BOARD_TYPE[config.value.type].name)
      }
      post.value = result.post
      tags.value = result.tags
      files.value = result.files
      images.value = result.images
      prevPostUid.value = result.prevPostUid
      nextPostUid.value = result.nextPostUid
      writerPosts.value = result.writerPosts
      writerComments.value = result.writerComments

      auth.user.admin =
        result.config.admin.group === auth.user.uid || result.config.admin.board === auth.user.uid
    } finally {
      loading.value = false
    }
  }

  // 게시글에 좋아요 추가 (혹은 취소) 하기
  async function like(isLike: boolean): Promise<void> {
    const fd = new FormData()
    fd.append("boardUid", config.value.uid.toString())
    fd.append("postUid", postUid.value.toString())
    fd.append("liked", isLike ? "1" : "0")

    const response = await axios.patch(`${TSBOARD.API}/board/like`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
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
    const response = await axios.get(`${TSBOARD.API}/board/download`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        boardUid: config.value.uid,
        fileUid,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_DOWNLOAD} (${response.data.error})`)
    }

    const result = response.data.result as BoardViewDownloadResult
    const link = document.createElement("a")
    link.href = `${TSBOARD.SITE.URL}/${result.path}`
    link.download = result.name
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
    const response = await axios.get(`${TSBOARD.API}/board/move/list`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        boardUid: config.value.uid,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_LOAD_BOARD_LISTS} (${response.data.error})`)
    }

    boardListItems.value = response.data.result as BoardItem[]
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

    const response = await axios.delete(`${TSBOARD.API}/board/remove/post`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        boardUid: config.value.uid,
        postUid: postUid.value,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_REMOVE_POST} (${response.data.error})`)
    }

    util.snack(TEXT[home.lang].REMOVED_POST)
    closeConfirmRemoveDialog()

    util.go(util.routerName(config.value.type, BOARD_ACTION.LIST), id.value)
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
  function selectMoveTarget(target: BoardItem): void {
    moveTarget.value = target
  }

  // 이동 적용
  async function applyMovePost(): Promise<void> {
    const fd = new FormData()
    fd.append("boardUid", config.value.uid.toString())
    fd.append("postUid", postUid.value.toString())
    fd.append("targetBoardUid", moveTarget.value.uid.toString())

    const response = await axios.put(`${TSBOARD.API}/board/move/apply`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // 본문 내용을 클립보드에 복사하기
  function copyToClipboard(): void {
    navigator.clipboard
      .writeText(util.unescape(post.value.content))
      .then(() => util.snack(TEXT[home.lang].COPIED_CLIPBOARD))
      .catch(() => util.snack(TEXT[home.lang].FAILED_CLIPBOARD))
  }

  return {
    loading,
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
    copyToClipboard,
  }
})
