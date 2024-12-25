import { defineStore } from "pinia"
import { ref } from "vue"
import { NavigationFailure, useRoute, useRouter } from "vue-router"
import { TEXT } from "../../messages/store/board/list"
import { useHomeStore } from "../home"
import { useAuthStore } from "../user/auth"
import { useUtilStore } from "../util"
import {
  BOARD,
  BOARD_ACTION,
  BOARD_CONFIG,
  Board,
  BoardConfig,
  BoardListItem,
  BoardListResult,
  CONVERT_BOARD_TYPE,
  PAGE,
  Paging,
  Pair,
  SEARCH,
  STATUS,
  Search,
} from "../../interface/board_interface"
import axios from "axios"
import { TSBOARD } from "../../../tsboard.config"

export const useBoardListStore = defineStore("boardList", () => {
  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const loading = ref<boolean>(false)
  const id = ref<string>("")
  const config = ref<BoardConfig>(BOARD_CONFIG)
  const isAdmin = ref<boolean>(false)
  const posts = ref<BoardListItem[]>([])
  const categories = ref<Pair[]>([])
  const page = ref<number>(1)
  const pageLength = ref<number>(1)
  const sinceUid = ref<number>(0)
  const pagingDirection = ref<Paging>(PAGE.NEXT as Paging)
  const option = ref<Search>(SEARCH.TITLE as Search)
  const keyword = ref<string>("")
  const keywordHistories = ref<string[]>([])
  const isFirstInit = ref<boolean>(false)

  // 게시글 목록 가져오기
  async function loadPostList(): Promise<NavigationFailure | void | undefined> {
    loading.value = true
    try {
      id.value = route.params.id as string
      if (id.value.length < 2) {
        return util.snack(TEXT[home.lang].NO_BOARD_ID)
      }

      const response = await axios.get(`${TSBOARD.API}/board/list`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
        params: {
          id: id.value,
          page: page.value,
          pagingDirection: pagingDirection.value,
          sinceUid: sinceUid.value,
          option: option.value,
          keyword: keyword.value,
        },
      })

      if (!response.data) {
        return util.snack(TEXT[home.lang].NO_RESPONSE)
      }
      if (response.data.success === false) {
        config.value = response.data.result.config
        return util.snack(`${TEXT[home.lang].FAILED_LOAD_LIST} (${response.data.error})`)
      }

      const result = response.data.result as BoardListResult
      config.value = result.config
      isAdmin.value = result.isAdmin

      if (route.path.includes(CONVERT_BOARD_TYPE[config.value.type as number].path) === false) {
        return util.go(CONVERT_BOARD_TYPE[config.value.type].name)
      }

      result.posts.map((post: BoardListItem): void => {
        if (result.blackList.includes(post.writer.uid) === true) {
          post.uid = 0
          post.writer.uid = 0
          post.writer.name = "X"
          post.like = 0
          post.liked = false
          post.title = TEXT[home.lang].BLACKLIST_POST
          return
        }
      })

      posts.value = result.posts
      let noticeCount = 0
      posts.value.map((post: BoardListItem) => {
        if (post.status === STATUS.NOTICE) {
          noticeCount += 1
        }
      })
      pageLength.value = Math.ceil(
        response.data.result.totalPostCount / (config.value.rowCount - noticeCount),
      )

      if (pagingDirection.value === (PAGE.PREV as Paging)) {
        rearrangePosts()
      }
    } finally {
      loading.value = false
    }
  }

  // 게시판 목록 마운트 시점에 호출
  function initFirstList(): void {
    isFirstInit.value = true
    const name = util.routerName(BOARD.DEFAULT as Board, BOARD_ACTION.PAGING)
    const pageStr = page.value.toString()

    if (page.value > 1 && sinceUid.value > 0) {
      loadPostList()
      router.replace({ name, params: { id: id.value, page: pageStr } })
    } else {
      resetBoardList()
      router.replace({ name, params: { id: id.value, page: "1" } })
    }
  }

  // 페이징이 변경될 때마다 호출
  async function watchChangingPage(now: number, prev: number): Promise<void> {
    if (isFirstInit.value === true) {
      isFirstInit.value = false
    } else {
      page.value = prev < 1 ? 1 : prev
      if (now >= prev) {
        setNextPosts()
      } else {
        setPrevPosts()
      }
      await loadPostList()
    }
  }

  // 게시판 목록 초기화
  async function resetBoardList(): Promise<void> {
    sinceUid.value = 0
    page.value = 1
    pagingDirection.value = PAGE.NEXT as Paging

    await loadPostList()
    home.setGridLayout()
  }

  // 이전 페이지로 이동 준비
  function setPrevPosts(): void {
    page.value -= 1
    const _page = page.value - 1
    pagingDirection.value = PAGE.PREV as Paging

    if (_page < 2) {
      util.snack(TEXT[home.lang].FIRST_PAGE)
    }
    page.value = _page
    sinceUid.value = posts.value.at(0)?.uid ?? 0
  }

  // 이전 페이지 가져온 후 데이터 처리 (순서 뒤집기 등)
  function rearrangePosts(): void {
    const notices = posts.value.filter((post: BoardListItem) => {
      return post.status === STATUS.NOTICE
    })
    const normals = posts.value.reverse().filter((post: BoardListItem) => {
      return post.status === STATUS.NORMAL
    })
    posts.value = [...notices, ...normals]
  }

  // 다음 페이지로 이동 준비
  function setNextPosts(): void {
    const _page = page.value + 1
    pagingDirection.value = PAGE.NEXT as Paging

    if (_page === pageLength.value) {
      util.snack(TEXT[home.lang].LAST_PAGE)
    }
    page.value = _page
    sinceUid.value = posts.value.at(-1)?.uid ?? 0
  }

  // 이전 페이지 이동하기
  function movePrevPage(): void {
    const _page = page.value - 1
    router.push({
      name: util.routerName(BOARD.DEFAULT as Board, BOARD_ACTION.PAGING),
      params: { id: id.value, page: _page },
    })
    page.value = _page
  }

  // 다음 페이지 이동하기
  function moveNextPage(): void {
    const _page = page.value + 1
    router.push({
      name: util.routerName(BOARD.DEFAULT as Board, BOARD_ACTION.PAGING),
      params: { id: id.value, page: _page },
    })
    page.value = _page
  }

  // 검색 옵션 초기화하기
  function resetSearchKeyword(): void {
    option.value = SEARCH.TITLE as Search
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
    option.value = SEARCH.CATEGORY as Search
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
    loading,
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
    initFirstList,
    watchChangingPage,
    resetBoardList,
    movePrevPage,
    moveNextPage,
    resetSearchKeyword,
    loadPostsByCategory,
    enterSearchKeyword,
    selectKeywordFromHistory,
    init,
  }
})
