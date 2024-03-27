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
import { GroupItem, LatestPost, NoticeType, Notification, PostItem } from "../interface/home"
import { NOTICE_TYPE } from "../../server/database/board/const"
import { HOME } from "../messages/store/home"
import { SEARCH_OPTION, SearchOption } from "../interface/board"
import { TSBOARD } from "../../tsboard.config"

export const useHomeStore = defineStore("home", () => {
  const server = edenTreaty<App>(process.env.API!)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const drawer = ref<boolean>(false)
  const notifications = ref<Notification[]>([])
  const haveNewNotification = ref<boolean>(false)
  const sidebarLinks = ref<GroupItem[]>([])
  const sidebarWidth = ref<number>(300)
  const width = ref<number>(TSBOARD.SCREEN.PC)
  const staticWidth = ref<number>(TSBOARD.SCREEN.TABLET)
  const cols = ref<number>(3)
  const sinceUid = ref<number>(0)
  const bunch = ref<number>(12)
  const latestPosts = ref<PostItem[]>([])
  const option = ref<SearchOption>(SEARCH_OPTION.TITLE as SearchOption)
  const keyword = ref<string>("")
  const color = ref({
    header: "blue-grey-darken-3",
    footer: "blue-grey-lighten-5",
    admin: {
      header: "blue-grey-lighten-5",
      footer: "blue-grey-lighten-5",
    },
  })

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

    const lastVisit = window.localStorage.getItem("tsboardVisit") ?? ""
    if (lastVisit === today) {
      return
    }
    window.localStorage.setItem("tsboardVisit", today)
    server.api.home.visit.get({
      $query: {
        userUid: auth.user.uid,
      },
    })
  }

  // 최신글 그리드 개수 및 최대 너버 지정
  function setGridLayout(): void {
    width.value = window.innerWidth - Math.floor(window.innerWidth / 20)
    if (window.innerWidth < TSBOARD.SCREEN.MOBILE) {
      cols.value = 12
    } else if (
      window.innerWidth >= TSBOARD.SCREEN.MOBILE &&
      window.innerWidth < TSBOARD.SCREEN.TABLET
    ) {
      cols.value = 6
    } else if (
      window.innerWidth >= TSBOARD.SCREEN.TABLET &&
      window.innerWidth < TSBOARD.SCREEN.PC
    ) {
      cols.value = 4
    } else if (window.innerWidth >= TSBOARD.SCREEN.PC && window.innerWidth < TSBOARD.SCREEN.LARGE) {
      cols.value = 3
    } else {
      cols.value = 3
      width.value = TSBOARD.SCREEN.LARGE
    }
  }

  // 최신글 목록 가져오기
  async function loadLatestPosts(): Promise<void> {
    setGridLayout()
    const response = await server.api.home.latest.get({
      $query: {
        sinceUid: sinceUid.value,
        bunch: bunch.value,
        option: option.value as number,
        keyword: keyword.value,
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
  async function getBoardLatest(id: string, limit: number): Promise<LatestPost[]> {
    let result: LatestPost[] = []
    if (id.length < 2 || limit < 1) {
      return result
    }
    const response = await server.api.home.latest.board.get({
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
    const response = await server.api.home.load.notification.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        limit: 10,
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
    const response = await server.api.home.checked.notification.patch({
      $headers: {
        authorization: auth.user.token,
      },
    })
  }

  // 알림 내용 해석하기
  function translateNotification(type: NoticeType): string {
    let result = ""
    switch (type) {
      case NOTICE_TYPE.LIKE_POST as NoticeType:
        result = HOME.LIKE_POST
        break
      case NOTICE_TYPE.LIKE_COMMENT as NoticeType:
        result = HOME.LIKE_COMMENT
        break
      case NOTICE_TYPE.LEAVE_COMMENT as NoticeType:
        result = HOME.LEAVE_COMMENT
        break
      case NOTICE_TYPE.REPLY_COMMENT as NoticeType:
        result = HOME.REPLY_COMMENT
        break
      default:
        result = HOME.CHAT_MESSAGE
    }
    return result
  }

  // 사이드바 링크들 가져오기
  async function loadSidebarLinks(): Promise<void> {
    const response = await server.api.home.sidebar.links.get()
    if (response.data && response.data.success === true) {
      sidebarLinks.value = response.data.result
    }
  }

  return {
    drawer,
    notifications,
    haveNewNotification,
    width,
    staticWidth,
    cols,
    sidebarLinks,
    sidebarWidth,
    sinceUid,
    latestPosts,
    option,
    keyword,
    color,
    coming,
    visit,
    setGridLayout,
    loadLatestPosts,
    getBoardLatest,
    searchPosts,
    resetSearchKeyword,
    loadNotification,
    translateNotification,
    checkedAllNotifications,
    loadSidebarLinks,
  }
})
