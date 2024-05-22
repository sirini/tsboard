/**
 * store/home
 *
 * 웹사이트 내에서 활용 가능한 각종 함수들
 */

import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../server/index"
import { useAuthStore } from "./user/auth"
import { useUtilStore } from "./util"
import {
  BoardLatest,
  GroupItem,
  LANG,
  LANG_KEY,
  LangType,
  LatestPost,
  NoticeType,
  TsboardNotification,
  PostItem,
  VISIT_KEY,
} from "../interface/home"
import { NOTICE_TYPE, SEARCH_OPTION } from "../../server/database/board/const"
import { TEXT } from "../messages/store/home"
import { SearchOption } from "../interface/board"
import { SCREEN, TSBOARD } from "../../tsboard.config"

export const useHomeStore = defineStore("home", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const drawer = ref<boolean>(false)
  const notifications = ref<TsboardNotification[]>([])
  const haveNewNotification = ref<boolean>(false)
  const sidebarLinks = ref<GroupItem[]>([])
  const sidebarWidth = ref<number>(300)
  const width = ref<number>(SCREEN.PC.WIDTH)
  const staticWidth = ref<number>(SCREEN.TABLET.WIDTH)
  const dialogWidth = ref<number>(600)
  const cols = ref<number>(SCREEN.PC.COLS)
  const sinceUid = ref<number>(0)
  const bunch = ref<number>(16)
  const latestPosts = ref<PostItem[]>([])
  const option = ref<SearchOption>(SEARCH_OPTION.TITLE as SearchOption)
  const keyword = ref<string>("")
  const keywordHistories = ref<string[]>([])
  const isMobile = ref<boolean>(false)
  const isTablet = ref<boolean>(false)
  const isPC = ref<boolean>(true)
  const isLarge = ref<boolean>(false)
  const lang = ref<LangType>(LANG.KO as LangType)
  const langName = ref<string>("한국어")
  const langIcon = ref<string>("mdi-syllabary-hangul")
  const color = ref({
    header: "blue-grey-darken-3",
    footer: "blue-grey-lighten-5",
    admin: {
      header: "blue-grey-lighten-5",
      footer: "blue-grey-lighten-5",
    },
  })

  loadUserLanguage()

  // 첫화면 갱신하기
  function coming(): void {
    clearVariables()
    if (route.name === "home") {
      loadLatestPosts()
      return
    }
    util.go("home")
  }

  // 방문 기록 저장하기
  async function visit(): Promise<void> {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const today = `${year}${month}${day}`

    const lastVisit = window.localStorage.getItem(VISIT_KEY) ?? ""
    if (lastVisit === today) {
      return
    }
    window.localStorage.setItem(VISIT_KEY, today)
    client.tsapi.home.visit.get({
      $query: {
        userUid: auth.user.uid,
      },
    })
  }

  // 최신글 그리드 개수 및 최대 너버 지정
  function setGridLayout(): void {
    width.value = window.innerWidth - Math.floor(window.innerWidth / 20)
    isMobile.value = false
    isTablet.value = false
    isPC.value = false
    isLarge.value = false

    if (window.innerWidth < SCREEN.MOBILE.WIDTH) {
      cols.value = SCREEN.MOBILE.COLS
      width.value = window.innerWidth - Math.floor(window.innerWidth / 10)
      isMobile.value = true
    } else if (
      window.innerWidth >= SCREEN.MOBILE.WIDTH &&
      window.innerWidth < SCREEN.TABLET.WIDTH
    ) {
      cols.value = SCREEN.TABLET.COLS
      width.value = window.innerWidth - Math.floor(window.innerWidth / 10)
      isTablet.value = true
    } else if (window.innerWidth >= SCREEN.TABLET.WIDTH && window.innerWidth < SCREEN.PC.WIDTH) {
      cols.value = SCREEN.PC.COLS
      isPC.value = true
    } else if (window.innerWidth >= SCREEN.PC.WIDTH && window.innerWidth < SCREEN.LARGE.WIDTH) {
      cols.value = SCREEN.LARGE.COLS
      isLarge.value = true
    } else {
      cols.value = SCREEN.LARGE.COLS
      width.value = SCREEN.LARGE.WIDTH - 50
      isLarge.value = true
    }
  }

  // 최신글 목록 가져오기
  async function loadLatestPosts(): Promise<void> {
    setGridLayout()
    const response = await client.tsapi.home.latest.get({
      $query: {
        sinceUid: sinceUid.value,
        bunch: bunch.value,
        option: option.value as number,
        keyword: keyword.value,
        accessUserUid: auth.user.uid,
      },
    })

    if (response.data && response.data.success === true) {
      if (sinceUid.value < 1) {
        latestPosts.value = response.data.result
      } else {
        latestPosts.value.push(...response.data.result)
      }
      sinceUid.value = latestPosts.value.at(-1)?.uid ?? 0
    }
  }

  // 특정 게시판의 최신글 목록 가져오기
  async function getBoardLatest(id: string, limit: number): Promise<BoardLatest> {
    let result: BoardLatest = {
      name: "",
      latest: [] as LatestPost[],
    }
    if (id.length < 2 || limit < 1) {
      return result
    }
    const response = await client.tsapi.home.latest.board.get({
      $query: {
        id,
        limit,
      },
    })

    if (response.data && response.data.success === true) {
      result = response.data.result
    }
    return result
  }

  // 전체 게시글 검색하기
  function _searchPosts(): void {
    if (keyword.value.length < 2) {
      return
    }
    sinceUid.value = 0
    latestPosts.value = []
    loadLatestPosts()
  }
  const searchPosts = util.debounce(_searchPosts, 250)

  // 검색어 입력 확정 (검색어 히스토리 추가)
  function enterSearchPosts(): void {
    _searchPosts()
    keywordHistories.value.push(keyword.value)
    if (keywordHistories.value.length > 10) {
      keywordHistories.value.splice(0, 1)
    }
  }

  // 검색어 히스토리에서 이전 검색어 클릭 시 업데이트
  function selectKeywordFromHistory(selectedKeyword: string): void {
    keyword.value = selectedKeyword
    _searchPosts()
  }

  // 검색 옵션 초기화하기
  function resetSearchKeyword(): void {
    clearVariables()
    loadLatestPosts()
  }

  // 게시글 목록 가져오는 옵션 초기화하기
  function clearVariables(): void {
    sinceUid.value = 0
    latestPosts.value = []
    option.value = SEARCH_OPTION.TITLE as SearchOption
    keyword.value = ""
  }

  // 알림 정보 가져오기
  async function loadNotification(): Promise<void> {
    if (auth.user.uid < 1) {
      return
    }
    const response = await client.tsapi.home.load.notification.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        limit: 10,
        userUid: auth.user.uid,
      },
    })

    if (response.data && response.data.success === true && response.data.result.length > 0) {
      notifications.value = response.data.result
      notifications.value.map((noti) => {
        if (noti.checked === false) {
          haveNewNotification.value = true
          return
        }
      })
    }
  }

  // 알림 확인 처리하기
  async function checkedAllNotifications(): Promise<void> {
    if (auth.user.uid < 1) {
      return
    }
    const response = await client.tsapi.home.checked.notification.patch({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        userUid: auth.user.uid,
      },
    })
  }

  // 알림 내용 해석하기
  function translateNotification(type: NoticeType): string {
    let result = ""
    switch (type) {
      case NOTICE_TYPE.LIKE_POST as NoticeType:
        result = TEXT[lang.value].LIKE_POST
        break
      case NOTICE_TYPE.LIKE_COMMENT as NoticeType:
        result = TEXT[lang.value].LIKE_COMMENT
        break
      case NOTICE_TYPE.LEAVE_COMMENT as NoticeType:
        result = TEXT[lang.value].LEAVE_COMMENT
        break
      case NOTICE_TYPE.REPLY_COMMENT as NoticeType:
        result = TEXT[lang.value].REPLY_COMMENT
        break
      default:
        result = TEXT[lang.value].CHAT_MESSAGE
    }
    return result
  }

  // 사이드바 링크들 가져오기
  async function loadSidebarLinks(): Promise<void> {
    const response = await client.tsapi.home.sidebar.links.get()
    if (response.data && response.data.success === true) {
      sidebarLinks.value = response.data.result
    }
  }

  // 선택한 언어의 이름과 대표 아이콘 반환
  function updateLanguageInfo(): void {
    if (lang.value === (LANG.EN as LangType)) {
      langName.value = "English"
      langIcon.value = "mdi-alphabetical-variant"
    } else if (lang.value === (LANG.CN as LangType)) {
      langName.value = "中文"
      langIcon.value = "mdi-ideogram-cjk"
    } else {
      langName.value = "한국어"
      langIcon.value = "mdi-syllabary-hangul"
    }
  }

  // 언어 변경하기
  function changeUserLanguage(type: LangType): void {
    lang.value = type
    window.localStorage.setItem(LANG_KEY, lang.value.toString())
    updateLanguageInfo()
  }

  // 기존에 선택된 언어 불러오기
  function loadUserLanguage(): void {
    const type = window.localStorage.getItem(LANG_KEY) ?? "0"
    lang.value = parseInt(type) as LangType
    updateLanguageInfo()
  }

  return {
    drawer,
    notifications,
    haveNewNotification,
    width,
    staticWidth,
    dialogWidth,
    cols,
    sidebarLinks,
    sidebarWidth,
    sinceUid,
    latestPosts,
    option,
    keyword,
    keywordHistories,
    isMobile,
    isTablet,
    isPC,
    isLarge,
    lang,
    langName,
    langIcon,
    color,
    coming,
    visit,
    setGridLayout,
    loadLatestPosts,
    getBoardLatest,
    searchPosts,
    enterSearchPosts,
    selectKeywordFromHistory,
    resetSearchKeyword,
    loadNotification,
    translateNotification,
    checkedAllNotifications,
    loadSidebarLinks,
    changeUserLanguage,
    loadUserLanguage,
  }
})
