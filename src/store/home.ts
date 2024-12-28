import { defineStore } from "pinia"
import { ref } from "vue"
import { useRoute } from "vue-router"
import { SCREEN, TSBOARD } from "../../tsboard.config"
import { TEXT } from "../messages/store/home"
import { useAuthStore } from "./user/auth"
import { useUtilStore } from "./util"
import axios from "axios"
import {
  BOARD_HOME_POST_RESULT,
  BoardHomePostItem,
  BoardHomePostResult,
  HomeLang,
  HomeNotice,
  HomeSidebarGroupResult,
  LANG,
  LANG_KEY,
  VISIT_KEY,
} from "../interface/home_interface"
import { SEARCH, Search } from "../interface/board_interface"
import { NOTICE, NotificationItem } from "../interface/noti_interface"

export const CATEGORY_WINDOW = 1
export const LATEST_WINDOW = 2

export const useHomeStore = defineStore("home", () => {
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const drawer = ref<boolean>(false)
  const notifications = ref<NotificationItem[]>([])
  const haveNewNotification = ref<boolean>(false)
  const sidebarLinks = ref<HomeSidebarGroupResult[]>([])
  const sidebarWidth = ref<number>(250)
  const width = ref<number>(SCREEN.PC.WIDTH)
  const staticWidth = ref<number>(SCREEN.TABLET.WIDTH)
  const dialogWidth = ref<number>(500)
  const cols = ref<number>(SCREEN.PC.COLS)
  const sinceUid = ref<number>(0)
  const bunch = ref<number>(12)
  const latestPosts = ref<BoardHomePostItem[]>([])
  const option = ref<Search>(SEARCH.TITLE as Search)
  const keyword = ref<string>("")
  const keywordHistories = ref<string[]>([])
  const isMobile = ref<boolean>(false)
  const isTablet = ref<boolean>(false)
  const isPC = ref<boolean>(true)
  const isLarge = ref<boolean>(false)
  const lang = ref<HomeLang>(LANG.KO as HomeLang)
  const langName = ref<string>("한국어")
  const langIcon = ref<string>("mdi-syllabary-hangul")
  const tab = ref<number>(CATEGORY_WINDOW)
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

    axios.get(`${TSBOARD.API}/home/visit`, {
      params: {
        userUid: auth.user.uid,
      },
    })
  }

  // 최신글 그리드 개수 및 최대 너버 지정
  function setGridLayout(): void {
    isMobile.value = false
    isTablet.value = false
    isPC.value = false
    isLarge.value = false
    const ww = window.innerWidth
    width.value = ww - Math.floor(ww / 20)

    if (ww < SCREEN.MOBILE.WIDTH) {
      cols.value = SCREEN.MOBILE.COLS
      width.value = ww - Math.floor(ww / 10)
      isMobile.value = true
    } else if (ww >= SCREEN.MOBILE.WIDTH && ww < SCREEN.TABLET.WIDTH) {
      cols.value = SCREEN.TABLET.COLS
      width.value = ww - Math.floor(ww / 10)
      isTablet.value = true
    } else if (ww >= SCREEN.TABLET.WIDTH && ww < SCREEN.PC.WIDTH) {
      cols.value = SCREEN.PC.COLS
      isPC.value = true
    } else if (ww >= SCREEN.PC.WIDTH && ww < SCREEN.LARGE.WIDTH) {
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

    const response = await axios.get(`${TSBOARD.API}/home/latest`, {
      params: {
        sinceUid: sinceUid.value,
        bunch: bunch.value,
        option: option.value,
        keyword: encodeURIComponent(keyword.value),
        accessUserUid: auth.user.uid,
      },
    })

    if (response.data && response.data.success === true) {
      const result = response.data.result as BoardHomePostItem[]
      if (sinceUid.value < 1) {
        latestPosts.value = result
      } else {
        latestPosts.value.push(...result)
      }
      sinceUid.value = latestPosts.value.at(-1)?.uid ?? 0
    }
  }

  // 지정된 게시판의 최근 포스트들 반환
  async function getBoardLatestPosts(id: string, limit: number): Promise<BoardHomePostResult> {
    if (id.length < 2 || limit < 1) {
      return BOARD_HOME_POST_RESULT
    }

    const response = await axios.get(`${TSBOARD.API}/home/latest/post`, {
      params: {
        id,
        limit,
        accessUserUid: auth.user.uid,
      },
    })

    if (response.data && response.data.success === true) {
      return response.data.result as BoardHomePostResult
    }
    return BOARD_HOME_POST_RESULT
  }

  // 전체 게시글 검색하기
  function _searchPosts(): void {
    if (keyword.value.length < 2) {
      return
    }
    tab.value = LATEST_WINDOW
    sinceUid.value = 0
    latestPosts.value = []
    loadLatestPosts()
  }
  const searchPosts = util.debounce(_searchPosts, 250)

  // 검색어 입력 확정 (검색어 히스토리 추가)
  function enterSearchPosts(): void {
    if (keyword.value.length < 2) {
      resetSearchKeyword()
      return
    }
    _searchPosts()
    if (keywordHistories.value.includes(keyword.value) === true) {
      return
    }
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
    option.value = SEARCH.TITLE as Search
    keyword.value = ""
    tab.value = CATEGORY_WINDOW
  }

  // 알림 정보 가져오기
  async function loadNotification(): Promise<void> {
    if (auth.user.uid < 1) {
      return
    }

    const response = await axios.get(`${TSBOARD.API}/noti/load`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    if (response.data && response.data.success === true && response.data.result.length > 0) {
      const result = response.data.result as NotificationItem[]
      notifications.value = result
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

    const response = await axios.patch(
      `${TSBOARD.API}/noti/checked`,
      {},
      {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      },
    )
  }

  // 알림 내용 해석하기
  function translateNotification(type: HomeNotice): string {
    let result = ""
    switch (type) {
      case NOTICE.LIKE_POST as HomeNotice:
        result = TEXT[lang.value].LIKE_POST
        break
      case NOTICE.LIKE_COMMENT as HomeNotice:
        result = TEXT[lang.value].LIKE_COMMENT
        break
      case NOTICE.LEAVE_COMMENT as HomeNotice:
        result = TEXT[lang.value].LEAVE_COMMENT
        break
      case NOTICE.REPLY_COMMENT as HomeNotice:
        result = TEXT[lang.value].REPLY_COMMENT
        break
      default:
        result = TEXT[lang.value].CHAT_MESSAGE
    }
    return result
  }

  // 사이드바 링크들 가져오기
  async function loadSidebarLinks(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/home/sidebar/links`)
    if (response.data && response.data.success === true) {
      sidebarLinks.value = response.data.result as HomeSidebarGroupResult[]
    }
  }

  // 선택한 언어의 이름과 대표 아이콘 반환
  function updateLanguageInfo(): void {
    if (lang.value === (LANG.EN as HomeLang)) {
      langName.value = "English"
      langIcon.value = "mdi-alphabetical-variant"
    } else if (lang.value === (LANG.CN as HomeLang)) {
      langName.value = "中文"
      langIcon.value = "mdi-ideogram-cjk"
    } else {
      langName.value = "한국어"
      langIcon.value = "mdi-syllabary-hangul"
    }
  }

  // 언어 변경하기
  function changeUserLanguage(type: HomeLang): void {
    lang.value = type
    window.localStorage.setItem(LANG_KEY, lang.value.toString())
    updateLanguageInfo()
  }

  // 기존에 선택된 언어 불러오기
  function loadUserLanguage(): void {
    const type = window.localStorage.getItem(LANG_KEY) ?? "0"
    lang.value = parseInt(type) as HomeLang
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
    tab,
    coming,
    visit,
    setGridLayout,
    loadLatestPosts,
    getBoardLatestPosts,
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
