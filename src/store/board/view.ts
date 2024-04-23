/**
 * store/board/view
 *
 * 게시글 보기 및 댓글 보기와 관련한 상태 및 함수들
 */

import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../server/index"
import { useAuthStore } from "../user/auth"
import { useUtilStore } from "../util"
import { useHomeStore } from "../home"
import { BoardConfig, Pair, PostFile, PostView } from "../../interface/board"
import { TEXT } from "../../messages/store/board/view"
import { BOARD_CONFIG, TYPE_MATCH, INIT_POST_VIEW } from "../../../server/database/board/const"
import { TSBOARD } from "../../../tsboard.config"

export const useBoardViewStore = defineStore("boardView", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const confirmRemovePostDialog = ref<boolean>(false)
  const id = ref<string>("")
  const postUid = ref<number>(0)
  const config = ref<BoardConfig>(BOARD_CONFIG)
  const post = ref<PostView>(INIT_POST_VIEW)
  const files = ref<PostFile[]>([])
  const tags = ref<Pair[]>([])

  async function loadPostView(): Promise<void> {
    id.value = route.params.id as string
    postUid.value = parseInt(route.params.no as string)

    if (id.value.length < 2) {
      return util.snack(TEXT[home.lang].NO_BOARD_ID)
    }

    let needUpdateHit = 0
    if (util.isAlreadyRead(postUid.value) === false) {
      util.markAsRead(postUid.value)
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
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      config.value = response.data.result.config
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
    util.go(route.name === "galleryOpen" ? "galleryList" : "boardList", id.value)
  }

  return {
    confirmRemovePostDialog,
    id,
    postUid,
    config,
    post,
    files,
    tags,
    loadPostView,
    like,
    download,
    openConfirmRemoveDialog,
    closeConfirmRemoveDialog,
    removePost,
  }
})
