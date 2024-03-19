/**
 * store/home
 *
 * 웹사이트 내에서 활용 가능한 각종 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../server/index"
import { useAuthStore } from "./user/auth"
import { GroupItem, NoticeType, Notification, PostItem } from "../interface/home"
import { NOTICE_TYPE } from "../../server/database/board/const"
import { HOME } from "../messages/store/home"

export const useHomeStore = defineStore("home", () => {
  const server = edenTreaty<App>(process.env.API!)
  const auth = useAuthStore()
  const drawer = ref<boolean>(false)
  const notifications = ref<Notification[]>([])
  const haveNewNotification = ref<boolean>(false)
  const sidebarLinks = ref<GroupItem[]>([])
  const sinceUid = ref<number>(0)
  const bunch = ref<number>(12)
  const latestPosts = ref<PostItem[]>([])
  const color = {
    header: "blue-grey-darken-3",
    footer: "blue-grey-lighten-5",
    admin: {
      header: "blue-grey-lighten-5",
      footer: "blue-grey-lighten-5",
    },
  }
  const DEBUG = ref<string>("")

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

  // 최신글 목록 가져오기
  async function loadLatestPosts(): Promise<void> {
    const response = await server.api.home.latest.get({
      $query: {
        sinceUid: sinceUid.value,
        bunch: bunch.value,
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
    DEBUG,
    drawer,
    notifications,
    haveNewNotification,
    sidebarLinks,
    latestPosts,
    color,
    visit,
    loadLatestPosts,
    loadNotification,
    translateNotification,
    checkedAllNotifications,
    loadSidebarLinks,
  }
})
