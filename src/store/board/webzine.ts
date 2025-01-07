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
  Search,
} from "../../interface/board_interface"
import axios from "axios"
import { TSBOARD } from "../../../tsboard.config"
import { CODE, ResponseData } from "../../interface/util_interface"
import { ADMIN } from "../../messages/store/admin/admin"

export const useWebzineListStore = defineStore("webzineList", () => {
  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const loading = ref<boolean>(false)
  const id = ref<string>("")
  const config = ref<BoardConfig>(BOARD_CONFIG)
  const isAdmin = ref<boolean>(false)
  const notices = ref<BoardListItem[]>([])
  const posts = ref<BoardListItem[]>([])
  const categories = ref<Pair[]>([])
  const page = ref<number>(1)
  const pageLength = ref<number>(1)
  const sinceUid = ref<number>(0)
  const pagingDirection = ref<Paging>(PAGE.NEXT as Paging)
  const option = ref<Search>(SEARCH.TITLE as Search)
  const keyword = ref<string>("")
  const keywordHistories = ref<string[]>([])

  // 웹진 목록 가져오기
  async function loadWebzineList(): Promise<NavigationFailure | void | undefined> {
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
          keyword: encodeURIComponent(keyword.value),
        },
      })
      const data = response.data as ResponseData<BoardListResult>
      if (!data || data.success === false) {
        config.value = data.result.config
        if (data.code === CODE.INVALID_TOKEN && (await auth.updateAccessToken()) === true) {
          util.error(ADMIN.NEED_REFRESH)
        }
        return util.snack(`${TEXT[home.lang].FAILED_LOAD_LIST} (${data.error})`)
      }

      config.value = data.result.config
      isAdmin.value = data.result.isAdmin
      const convert = CONVERT_BOARD_TYPE[config.value.type]

      if (route.path.includes(convert.path) === false) {
        return util.go(convert.name)
      }

      data.result.posts.map((post: BoardListItem): void => {
        if (data.result.blackList.includes(post.writer.uid) === true) {
          post.uid = 0
          post.writer.uid = 0
          post.writer.name = "X"
          post.like = 0
          post.liked = false
          post.title = TEXT[home.lang].BLACKLIST_POST
          return
        }
      })

      notices.value = data.result.notices
      posts.value = data.result.posts
      pageLength.value = Math.ceil(
        data.result.totalPostCount / (config.value.rowCount - notices.value.length),
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
    const name = util.routerName(BOARD.WEBZINE as Board, BOARD_ACTION.PAGING)
    const pageStr = page.value.toString()

    if (page.value > 1 && sinceUid.value > 0) {
      loadWebzineList()
      router.replace({ name, params: { id: id.value, page: pageStr } })
    } else {
      resetBoardList()
      router.replace({ name, params: { id: id.value, page: "1" } })
    }
  }

  // 게시판 목록 초기화
  async function resetBoardList(): Promise<void> {
    sinceUid.value = 0
    page.value = 1
    pagingDirection.value = PAGE.NEXT as Paging

    await loadWebzineList()
    home.setGridLayout()
  }

  // 이전 페이지 가져온 후 데이터 처리 (순서 뒤집기 등)
  function rearrangePosts(): void {
    const normals = posts.value.reverse()
    posts.value = normals
  }

  // 이전 페이지로 이동 준비
  function setPrevPosts(): void {
    page.value -= 1
    pagingDirection.value = PAGE.PREV as Paging

    if (page.value < 2) {
      util.snack(TEXT[home.lang].FIRST_PAGE)
    }
    sinceUid.value = posts.value.at(0)?.uid ?? 0
  }

  // 다음 페이지로 이동 준비
  function setNextPosts(): void {
    page.value += 1
    pagingDirection.value = PAGE.NEXT as Paging

    if (page.value === pageLength.value) {
      util.snack(TEXT[home.lang].LAST_PAGE)
    }
    sinceUid.value = posts.value.at(-1)?.uid ?? 0
  }

  // 이전 페이지 이동하기
  function movePrevPage(): void {
    setPrevPosts()
    router.push({
      name: util.routerName(config.value.type, BOARD_ACTION.PAGING),
      params: { id: id.value, page: page.value },
    })
    loadWebzineList()
  }

  // 다음 페이지 이동하기
  function moveNextPage(): void {
    setNextPosts()
    router.push({
      name: util.routerName(config.value.type, BOARD_ACTION.PAGING),
      params: { id: id.value, page: page.value },
    })
    loadWebzineList()
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
    loadWebzineList()
  }

  // 검색어 확정하고 검색어 히스토리에 추가
  function enterSearchKeyword(): void {
    if (keyword.value.length < 2) {
      return
    }
    clearVariables()
    loadWebzineList()
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
    loadWebzineList()
  }

  // 게시판 목록보기 초기화
  function init(): void {
    clearVariables()
    resetSearchKeyword()
    resetBoardList()

    util.go(config.value.type, config.value.id)
  }

  return {
    loading,
    id,
    config,
    isAdmin,
    notices,
    posts,
    page,
    pageLength,
    categories,
    option,
    keyword,
    keywordHistories,
    loadWebzineList,
    initFirstList,
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
