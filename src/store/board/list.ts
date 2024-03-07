/**
 * store/board/list
 *
 * 게시판 목록보기와 관련한 상태 및 함수들
 */

import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../server/index"
import { useAuthStore } from "../user/auth"
import { useUtilStore } from "../util"
import { BoardConfig, Pair, Post } from "../../interface/board"
import { LIST } from "../../messages/store/board/list"
import { TYPE_MATCH, BOARD_CONFIG, PAGING_DIRECTION } from "../../../server/database/board/const"

export const useBoardListStore = defineStore("boardList", () => {
  const server = edenTreaty<App>(process.env.API!)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const id = ref<string>("")
  const config = ref<BoardConfig>(BOARD_CONFIG)
  const posts = ref<Post[]>([])
  const categories = ref<Pair[]>([])
  const page = ref<number>(1)
  const pageLength = ref<number>(1)
  const sinceUid = ref<number>(0)
  const pagingDirection = ref<number>(PAGING_DIRECTION.NEXT)

  // 게시글 목록 가져오기
  async function loadPostList(): Promise<void> {
    id.value = route.params.id as string
    if (id.value.length < 2) {
      util.snack(LIST.NO_BOARD_ID)
      return
    }
    const response = await server.api.board.list.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: id.value,
        page: page.value,
        pagingDirection: pagingDirection.value,
        sinceUid: sinceUid.value,
      },
    })

    if (!response.data) {
      util.snack(LIST.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      config.value = response.data.result.config
      util.snack(`${LIST.FAILED_LOAD_LIST} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    config.value = response.data.result.config

    if (route.path.includes(TYPE_MATCH[config.value.type].path) === false) {
      util.go(TYPE_MATCH[config.value.type].name)
      return
    }

    posts.value = response.data.result.posts
    pageLength.value = Math.ceil(response.data.result.totalPostCount / config.value.row)
  }

  // 이전 페이지 가져오기
  async function loadPrevPosts(): Promise<void> {
    page.value -= 1
    pagingDirection.value = PAGING_DIRECTION.PREV
    sinceUid.value = posts.value.at(0)?.uid ?? 0

    if (page.value < 2) {
      util.snack(LIST.FIRST_PAGE)
    }

    await loadPostList()
    posts.value = posts.value.reverse()
  }

  // 다음 페이지 가져오기
  async function loadNextPosts(): Promise<void> {
    page.value += 1
    pagingDirection.value = PAGING_DIRECTION.NEXT
    sinceUid.value = posts.value.at(-1)?.uid ?? 0

    await loadPostList()
    if (posts.value.length < config.value.row) {
      util.snack(LIST.LAST_PAGE)
    }
  }

  return {
    id,
    config,
    posts,
    page,
    pageLength,
    categories,
    loadPostList,
    loadPrevPosts,
    loadNextPosts,
  }
})
