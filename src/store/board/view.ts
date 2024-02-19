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
import { BoardConfig, Post, PostFile } from "../../interface/board"
import { INIT_CONFIG, INIT_POST, TYPE_MATCH } from "./const"
import { VIEW } from "../../messages/store/board/view"

export const useBoardViewStore = defineStore("boardView", () => {
  const server = edenTreaty<App>(process.env.API!)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const id = ref<string>("")
  const postUid = ref<number>(0)
  const config = ref<BoardConfig>(INIT_CONFIG)
  const post = ref<Post>(INIT_POST)
  const files = ref<PostFile[]>([])

  async function loadPostView(): Promise<void> {
    id.value = route.params.id as string
    postUid.value = parseInt(route.params.no as string)

    if (id.value.length < 2) {
      util.snack(VIEW.NO_BOARD_ID)
      return
    }
    const response = await server.api.board.view.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: id.value,
        postUid: postUid.value,
      },
    })
    if (!response.data) {
      util.snack(VIEW.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      config.value = response.data.result.config
      util.snack(`${VIEW.FAILED_LOAD_POST} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    config.value = response.data.result.config

    if (route.path.includes(TYPE_MATCH[config.value.type].path) === false) {
      util.go(TYPE_MATCH[config.value.type].name)
      return
    }
    post.value = response.data.result.post as Post
  }

  // 게시글에 좋아요 추가 (혹은 취소) 하기
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

  return {
    id,
    postUid,
    config,
    post,
    files,
    loadPostView,
    like,
  }
})
