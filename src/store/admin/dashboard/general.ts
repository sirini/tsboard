/**
 * store/admin/dashboard/general
 *
 * 각종 기본적인 수치 데이터들의 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../../server/index"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../auth"
import { AdminDashboardStat, AdminLatest, AdminUserInfo } from "../../../interface/admin"
import { GENERAL } from "../../../messages/store/admin/dashboard/general"

type Today = {
  year: string
  month: string
  date: string
}

export const useAdminDashboardStore = defineStore("adminDashboard", () => {
  const server = edenTreaty<App>(process.env.API!)
  const admin = useAdminStore()
  const auth = useAuthStore()
  const visit = ref<AdminDashboardStat>({
    total: 0,
    yesterday: 0,
    today: 0,
  })
  const member = ref<AdminDashboardStat>({
    total: 0,
    yesterday: 0,
    today: 0,
  })
  const post = ref<AdminDashboardStat>({
    total: 0,
    yesterday: 0,
    today: 0,
  })
  const posts = ref<AdminLatest[]>([])
  const comments = ref<AdminLatest[]>([])
  const reports = ref<AdminLatest[]>([])
  const groups = ref<string[]>([])
  const boards = ref<string[]>([])
  const members = ref<AdminUserInfo[]>([])

  // 현재 연월일 반환
  function today(): Today {
    const d = new Date()
    const year = `${d.getFullYear()}`
    const month = `0${d.getMonth() + 1}`.slice(1)
    const date = `0${d.getDate()}`.slice(1)
    return {
      year,
      month,
      date,
    }
  }

  // 간단 통계 데이터 가져오기
  async function loadStatistics(): Promise<void> {
    const response = await server.api.admin.dashboard.general.load.statistic.get({
      $headers: {
        authorization: auth.user.token,
      },
    })
    if (!response.data) {
      admin.error(GENERAL.NO_RESPONSE)
      return
    }
    if (!response.data.result) {
      admin.error(GENERAL.FAILED_LOAD)
      return
    }
    visit.value = response.data.result.visit as AdminDashboardStat
    member.value = response.data.result.member as AdminDashboardStat
    post.value = response.data.result.post as AdminDashboardStat
  }

  // 최신 글/댓글/신고 가져오기
  async function loadLatests(): Promise<void> {
    const response = await server.api.admin.dashboard.general.load.latest.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        limit: 5,
      },
    })
    if (!response.data) {
      admin.error(GENERAL.NO_RESPONSE)
      return
    }
    if (!response.data.result) {
      admin.error(GENERAL.FAILED_LOAD)
      return
    }
    posts.value = response.data.result.posts as AdminLatest[]
    comments.value = response.data.result.comments as AdminLatest[]
    reports.value = response.data.result.reports as AdminLatest[]
  }

  // 그룹/게시판/회원 최신 목록 가져오기
  async function loadItems(): Promise<void> {
    const response = await server.api.admin.dashboard.general.load.item.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        limit: 5,
      },
    })
    if (!response.data) {
      admin.error(GENERAL.NO_RESPONSE)
      return
    }
    if (!response.data.result) {
      admin.error(GENERAL.FAILED_LOAD)
      return
    }
    groups.value = response.data.result.groups as string[]
    boards.value = response.data.result.boards as string[]
    members.value = response.data.result.members as AdminUserInfo[]
  }

  return {
    visit,
    member,
    post,
    posts,
    comments,
    reports,
    groups,
    boards,
    members,
    today,
    loadStatistics,
    loadLatests,
    loadItems,
  }
})