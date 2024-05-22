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
import { BoardConfig, Pair, Post, SearchOption } from "../../interface/board"
import { SEARCH_OPTION } from "../../../server/database/board/const"
import { TEXT } from "../../messages/store/board/list"
import {
  TYPE_MATCH,
  BOARD_CONFIG,
  PAGING_DIRECTION,
  CONTENT_STATUS,
} from "../../../server/database/board/const"
import { TSBOARD } from "../../../tsboard.config"

export const useBoardListStore = defineStore("boardList", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const id = ref<string>("")
  const config = ref<BoardConfig>(BOARD_CONFIG)
  const isAdmin = ref<boolean>(false)
  const posts = ref<Post[]>([])
  const categories = ref<Pair[]>([])
  const page = ref<number>(1)
  const pageLength = ref<number>(1)
  const sinceUid = ref<number>(0)
  const pagingDirection = ref<number>(PAGING_DIRECTION.NEXT)
  const option = ref<SearchOption>(SEARCH_OPTION.TITLE as SearchOption)
  const keyword = ref<string>("")
  const keywordHistories = ref<string[]>([])

  // 게시글 목록 가져오기
  async function loadPostList(): Promise<void> {
    id.value = route.params.id as string
    if (id.value.length < 2) {
      return util.snack(TEXT[home.lang].NO_BOARD_ID)
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
        userUid: auth.user.uid,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      config.value = response.data.result.config
      return util.snack(`${TEXT[home.lang].FAILED_LOAD_LIST} (${response.data.error})`)
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    config.value = response.data.result.config
    isAdmin.value = response.data.result.isAdmin

    if (route.path.includes(TYPE_MATCH[config.value.type as number].path) === false) {
      return util.go(TYPE_MATCH[config.value.type].name)
    }

    response.data.result.posts.map((post): void => {
      if (response.data.result.blackList.includes(post.writer.uid) === true) {
        post.uid = 0
        post.writer.uid = 0
        post.writer.name = "X"
        post.like = 0
        post.liked = false
        post.title = TEXT[home.lang].BLACKLIST_POST
        return
      }
    })

    posts.value = response.data.result.posts
    let noticeCount = 0
    posts.value.map((post) => {
      if (post.status === CONTENT_STATUS.NOTICE) {
        noticeCount += 1
      }
    })
    pageLength.value = Math.ceil(
      response.data.result.totalPostCount / (config.value.rowCount - noticeCount),
    )
  }

  // 게시판 목록 초기화
  async function resetBoardList(): Promise<void> {
    sinceUid.value = 0
    page.value = 1
    pagingDirection.value = PAGING_DIRECTION.NEXT
    await loadPostList()
    home.setGridLayout()
  }

  // 이전 페이지 가져오기 (공지글 먼저 올리고, 나머진 순서 반대로 해주기)
  async function loadPrevPosts(): Promise<void> {
    page.value -= 1
    pagingDirection.value = PAGING_DIRECTION.PREV
    posts.value.map((post) => {
      if (post.status === CONTENT_STATUS.NORMAL && sinceUid.value < post.uid) {
        sinceUid.value = post.uid
      }
    })

    if (page.value < 2) {
      util.snack(TEXT[home.lang].FIRST_PAGE)
    }

    await loadPostList()
    const notices = posts.value.filter((post) => {
      return post.status === CONTENT_STATUS.NOTICE
    })
    const normals = posts.value.reverse().filter((post) => {
      return post.status === CONTENT_STATUS.NORMAL
    })
    posts.value = [...notices, ...normals]
  }

  // 다음 페이지 가져오기
  async function loadNextPosts(): Promise<void> {
    page.value += 1
    pagingDirection.value = PAGING_DIRECTION.NEXT
    sinceUid.value = posts.value.at(-1)?.uid ?? 0

    if (posts.value.length < config.value.rowCount) {
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

  // 검색어 확정하고 검색어 히스토리에 추가
  function enterSearchKeyword(): void {
    if (keyword.value.length < 2) {
      return
    }
    clearVariables()
    loadPostList()
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
    loadPostList()
  }

  // 게시판 목록보기 초기화
  function init(): void {
    clearVariables()
    resetSearchKeyword()
    resetBoardList()
  }

  return {
    id,
    config,
    isAdmin,
    posts,
    page,
    pageLength,
    categories,
    option,
    keyword,
    keywordHistories,
    loadPostList,
    resetBoardList,
    loadPrevPosts,
    loadNextPosts,
    resetSearchKeyword,
    loadPostsByCategory,
    enterSearchKeyword,
    selectKeywordFromHistory,
    init,
  }
})
