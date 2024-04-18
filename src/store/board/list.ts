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
import { useHomeStore } from "../home"
import { BoardConfig, Pair, Post, SEARCH_OPTION, SearchOption } from "../../interface/board"
import { TEXT } from "../../messages/store/board/list"
import { TYPE_MATCH, BOARD_CONFIG, PAGING_DIRECTION } from "../../../server/database/board/const"
import { TSBOARD } from "../../../tsboard.config"

export const useBoardListStore = defineStore("boardList", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const id = ref<string>("")
  const config = ref<BoardConfig>(BOARD_CONFIG)
  const posts = ref<Post[]>([])
  const categories = ref<Pair[]>([])
  const page = ref<number>(1)
  const pageLength = ref<number>(1)
  const sinceUid = ref<number>(0)
  const pagingDirection = ref<number>(PAGING_DIRECTION.NEXT)
  const option = ref<SearchOption>(SEARCH_OPTION.TITLE as SearchOption)
  const keyword = ref<string>("")

  // 게시글 목록 가져오기
  async function loadPostList(): Promise<void> {
    id.value = route.params.id as string
    if (id.value.length < 2) {
      util.snack(TEXT[home.lang].NO_BOARD_ID)
      return
    }
    const response = await client.tsapi.board.list.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: id.value,
        page: page.value,
        pagingDirection: pagingDirection.value,
        sinceUid: sinceUid.value,
        option: option.value as number,
        keyword: keyword.value,
      },
    })

    if (!response.data) {
      util.snack(TEXT[home.lang].NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      config.value = response.data.result.config
      util.snack(`${TEXT[home.lang].FAILED_LOAD_LIST} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    config.value = response.data.result.config

    if (route.path.includes(TYPE_MATCH[config.value.type as number].path) === false) {
      util.go(TYPE_MATCH[config.value.type].name)
      return
    }

    posts.value = response.data.result.posts
    pageLength.value = Math.ceil(response.data.result.totalPostCount / config.value.row)
  }

  // 게시판 목록 초기화
  async function resetBoardList(): Promise<void> {
    sinceUid.value = 0
    page.value = 1
    await loadPostList()
    home.setGridLayout()
  }

  // 이전 페이지 가져오기
  async function loadPrevPosts(): Promise<void> {
    page.value -= 1
    pagingDirection.value = PAGING_DIRECTION.PREV
    sinceUid.value = posts.value.at(0)?.uid ?? 0

    if (page.value < 2) {
      util.snack(TEXT[home.lang].FIRST_PAGE)
    }

    await loadPostList()
    posts.value = posts.value.reverse()
  }

  // 다음 페이지 가져오기
  async function loadNextPosts(): Promise<void> {
    page.value += 1
    pagingDirection.value = PAGING_DIRECTION.NEXT
    sinceUid.value = posts.value.at(-1)?.uid ?? 0

    if (posts.value.length < config.value.row) {
      util.snack(TEXT[home.lang].LAST_PAGE)
      sinceUid.value = 0
      return
    }

    await loadPostList()
  }

  // 검색 옵션 초기화하기
  function resetSearchKeyword(): void {
    option.value = SEARCH_OPTION.TITLE as SearchOption
    keyword.value = ""
  }

  // 게시글 목록 가져오는 옵션 초기화하기
  function clearVariables(): void {
    sinceUid.value = 0
    page.value = 1
    pageLength.value = 1
  }

  // 카테고리 번호에 해당하는 게시글들 가져오기
  function loadPostsByCategory(categoryUid: number): void {
    clearVariables()
    option.value = SEARCH_OPTION.CATEGORY as SearchOption
    keyword.value = categoryUid.toString()
    loadPostList()
  }

  // 검색하기
  function search(): void {
    if (keyword.value.length < 2) {
      return
    }
    clearVariables()
    loadPostList()
  }

  // 갤러리 목록보기 초기화
  function init(): void {
    clearVariables()
    resetSearchKeyword()
    loadPostList()
  }

  return {
    id,
    config,
    posts,
    page,
    pageLength,
    categories,
    option,
    keyword,
    loadPostList,
    resetBoardList,
    loadPrevPosts,
    loadNextPosts,
    resetSearchKeyword,
    loadPostsByCategory,
    search,
    init,
  }
})
