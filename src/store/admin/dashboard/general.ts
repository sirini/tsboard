import { defineStore } from "pinia"
import { ref } from "vue"
import { TSBOARD } from "../../../../tsboard.config"
import { GENERAL } from "../../../messages/store/admin/dashboard/general"
import { useAuthStore } from "../../user/auth"
import { useAdminStore } from "../common"
import axios from "axios"
import { BoardWriter, Pair } from "../../../interface/board_interface"
import {
  AdminDashboardLatestContent,
  AdminDashboardStatisticResult,
} from "../../../interface/admin_interface"

type Today = {
  year: string
  month: string
  date: string
}

export const useAdminDashboardStore = defineStore("adminDashboard", () => {
  const admin = useAdminStore()
  const auth = useAuthStore()
  const visit = ref({ total: 0, labels: [] as string[], values: [] as number[] })
  const member = ref({ total: 0, labels: [] as string[], values: [] as number[] })
  const post = ref({ total: 0, labels: [] as string[], values: [] as number[] })
  const reply = ref({ total: 0, labels: [] as string[], values: [] as number[] })
  const file = ref({ total: 0, labels: [] as string[], values: [] as number[] })
  const image = ref({ total: 0, labels: [] as string[], values: [] as number[] })
  const posts = ref<AdminDashboardLatestContent[]>([])
  const comments = ref<AdminDashboardLatestContent[]>([])
  const reports = ref<AdminDashboardLatestContent[]>([])
  const groups = ref<Pair[]>([])
  const boards = ref<Pair[]>([])
  const members = ref<BoardWriter[]>([])

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
    const response = await axios.get(`${TSBOARD.API}/admin/dashboard/general/load/statistic`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        limit: 7 /* days */,
      },
    })

    if (!response.data) {
      return admin.error(GENERAL.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return admin.error(`${GENERAL.FAILED_LOAD_DASHBOARD} (${response.data.error})`)
    }

    const result = response.data.result as AdminDashboardStatisticResult
    const items = [
      { target: member.value, data: result.member },
      { target: post.value, data: result.post },
      { target: reply.value, data: result.reply },
      { target: file.value, data: result.file },
      { target: image.value, data: result.image },
      { target: visit.value, data: result.visit },
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
    const response = await axios.get(`${TSBOARD.API}/admin/dashboard/general/load/latest`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        limit: 5,
      },
    })

    if (!response.data) {
      return admin.error(GENERAL.NO_RESPONSE)
    }

    posts.value = response.data.result.posts as AdminDashboardLatestContent[]
    comments.value = response.data.result.comments as AdminDashboardLatestContent[]
    reports.value = response.data.result.reports as AdminDashboardLatestContent[]
  }

  // 그룹/게시판/회원 최신 목록 가져오기
  async function loadItems(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/admin/dashboard/general/load/item`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        limit: 5,
      },
    })

    if (!response.data) {
      return admin.error(GENERAL.NO_RESPONSE)
    }
    groups.value = response.data.result.groups as Pair[]
    boards.value = response.data.result.boards as Pair[]
    members.value = response.data.result.members as BoardWriter[]
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
