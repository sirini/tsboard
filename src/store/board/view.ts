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
  STATUS,
} from "../../interface/board_interface"
import axios from "axios"
import { READ_POST_KEY } from "../../interface/post_interface"
import { CODE, ResponseData } from "../../interface/util_interface"
import { ADMIN } from "../../messages/store/admin/admin"

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
      const data = response.data as ResponseData<BoardViewResult>
      if (!data || data.success === false) {
        config.value = data.result.config
        post.value = BOARD_LIST_ITEM
        post.value.title = TEXT[home.lang].FAILED_TITLE
        post.value.content = TEXT[home.lang].FAILED_CONTENT
        files.value = [] as BoardAttachment[]
        images.value = [] as BoardAttachedImage[]
        prevPostUid.value = 0
        nextPostUid.value = 0

        if (data.code === CODE.INVALID_TOKEN && (await auth.updateAccessToken()) === true) {
          util.error(ADMIN.NEED_REFRESH)
        }
        return util.snack(`${TEXT[home.lang].FAILED_LOAD_POST} (${data.error})`)
      }
      config.value = data.result.config

      if (route.path.includes(CONVERT_BOARD_TYPE[config.value.type].path) === false) {
        return util.go(CONVERT_BOARD_TYPE[config.value.type].name)
      }

      post.value = data.result.post
      tags.value = data.result.tags
      files.value = data.result.files
      images.value = data.result.images
      prevPostUid.value = data.result.prevPostUid
      nextPostUid.value = data.result.nextPostUid
      writerPosts.value = data.result.writerPosts
      writerComments.value = data.result.writerComments

      if (
        post.value.status === STATUS.SECRET &&
        !auth.user.admin &&
        auth.user.uid != post.value.writer.uid
      ) {
        post.value.content = TEXT[home.lang].SECRET_POST
      }

      auth.user.admin =
        data.result.config.admin.group === auth.user.uid ||
        data.result.config.admin.board === auth.user.uid
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
    const data = response.data as ResponseData<null>
    if (data && data.success === true) {
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
    const data = response.data as ResponseData<BoardViewDownloadResult>
    if (!data || data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_DOWNLOAD} (${data.error})`)
    }

    const link = document.createElement("a")
    link.href = `${TSBOARD.SITE.URL}/${data.result.path}`
    link.download = data.result.name
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
    const data = response.data as ResponseData<BoardItem[]>
    if (!data || data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_LOAD_BOARD_LISTS} (${data.error})`)
    }

    boardListItems.value = data.result
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
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_REMOVE_POST} (${data.error})`)
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
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_MOVE_POST} (${data.error})`)
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
  async function prepareViewPost(): Promise<void> {
    await loadPostView()
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
