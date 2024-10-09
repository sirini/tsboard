/**
 * store/admin/dashboard/general
 *
 * 각종 기본적인 수치 데이터들의 상태 및 함수들
 */

import { edenTreaty } from "@elysiajs/eden"
import { defineStore } from "pinia"
import { ref } from "vue"
import type { App } from "../../../../server/index"
import { TSBOARD } from "../../../../tsboard.config"
import {
  AdminDashboardResult,
  AdminLatest,
  AdminReportLatest,
  AdminUserInfo,
} from "../../../interface/admin"
import { GENERAL } from "../../../messages/store/admin/dashboard/general"
import { useAuthStore } from "../../user/auth"
import { useAdminStore } from "../common"

type Today = {
  year: string
  month: string
  date: string
}

export const useAdminDashboardStore = defineStore("adminDashboard", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const admin = useAdminStore()
  const auth = useAuthStore()
  const visit = ref<AdminDashboardResult>({ total: 0, labels: [], values: [] })
  const member = ref<AdminDashboardResult>({ total: 0, labels: [], values: [] })
  const post = ref<AdminDashboardResult>({ total: 0, labels: [], values: [] })
  const reply = ref<AdminDashboardResult>({ total: 0, labels: [], values: [] })
  const file = ref<AdminDashboardResult>({ total: 0, labels: [], values: [] })
  const image = ref<AdminDashboardResult>({ total: 0, labels: [], values: [] })
  const posts = ref<AdminLatest[]>([])
  const comments = ref<AdminLatest[]>([])
  const reports = ref<AdminReportLatest[]>([])
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
    const response = await client.tsapi.admin.dashboard.general.load.statistic.get({
      $headers: {
        authorization: auth.user.token,
      },
    })

    if (!response.data) {
      return admin.error(GENERAL.NO_RESPONSE)
    }
    const items = [
      { target: member.value, data: response.data.result.member },
      { target: post.value, data: response.data.result.post },
      { target: reply.value, data: response.data.result.reply },
      { target: file.value, data: response.data.result.file },
      { target: image.value, data: response.data.result.image },
      { target: visit.value, data: response.data.result.visit },
    ]
    for (const item of items) {
      item.target.labels = []
      item.target.values = []
      item.target.total = item.data.total
      for (const history of item.data.history.reverse()) {
        const d = new Date(history.date)
        const month = (d.getMonth() + 1).toString().padStart(2, "0")
        const day = d.getDate().toString().padStart(2, "0")
        item.target.labels.push(`${month}/${day}`)
        item.target.values.push(history.visit)
      }
    }
  }

  // 최신 글/댓글/신고 가져오기
  async function loadLatests(): Promise<void> {
    const response = await client.tsapi.admin.dashboard.general.load.latest.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        limit: 5,
      },
    })

    if (!response.data) {
      return admin.error(GENERAL.NO_RESPONSE)
    }
    posts.value = response.data.result.posts
    comments.value = response.data.result.comments
    reports.value = response.data.result.reports
  }

  // 그룹/게시판/회원 최신 목록 가져오기
  async function loadItems(): Promise<void> {
    const response = await client.tsapi.admin.dashboard.general.load.item.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        limit: 5,
      },
    })

    if (!response.data) {
      return admin.error(GENERAL.NO_RESPONSE)
    }
    groups.value = response.data.result.groups
    boards.value = response.data.result.boards
    members.value = response.data.result.members
  }

  return {
    visit,
    member,
    post,
    reply,
    file,
    image,
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
