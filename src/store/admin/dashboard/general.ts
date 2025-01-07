import { defineStore } from "pinia"
import { ref } from "vue"
import { TSBOARD } from "../../../../tsboard.config"
import { GENERAL } from "../../../messages/store/admin/dashboard/general"
import { useAuthStore } from "../../user/auth"
import { useAdminStore } from "../common"
import axios from "axios"
import { BoardWriter, Pair } from "../../../interface/board_interface"
import {
  AdminDashboardItem,
  AdminDashboardLatest,
  AdminDashboardLatestContent,
  AdminDashboardStatisticResult,
} from "../../../interface/admin_interface"
import { CODE, ResponseData } from "../../../interface/util_interface"
import { ADMIN } from "../../../messages/store/admin/admin"

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
  const days = ref<number>(7)
  const height = ref<number>(80)
  const loading = ref<boolean>(false)

  // 통계 데이터 초기화
  function clearStatistics(): void {
    const targets = [visit, member, post, reply, file, image]
    targets.map((target) => {
      target.value = { total: 0, labels: [] as string[], values: [] as number[] }
    })
  }

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
    loading.value = true
    try {
      const response = await axios.get(`${TSBOARD.API}/admin/dashboard/general/load/statistic`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
        params: {
          limit: days.value,
        },
      })
      const data = response.data as ResponseData<AdminDashboardStatisticResult>
      if (!data || data.success === false) {
        if (data.code === CODE.INVALID_TOKEN && (await auth.updateAccessToken()) === true) {
          return admin.error(ADMIN.NEED_REFRESH)
        }
        return admin.error(`${GENERAL.FAILED_LOAD_DASHBOARD} (${data.error})`)
      }

      const items = [
        { target: member.value, data: data.result.member },
        { target: post.value, data: data.result.post },
        { target: reply.value, data: data.result.reply },
        { target: file.value, data: data.result.file },
        { target: image.value, data: data.result.image },
        { target: visit.value, data: data.result.visit },
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
    } finally {
      loading.value = false
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
    const data = response.data as ResponseData<AdminDashboardLatest>
    if (!data || data.success === false) {
      return admin.error(`${GENERAL.FAILED_LOAD_DASHBOARD} (${data.error})`)
    }

    posts.value = data.result.posts
    comments.value = data.result.comments
    reports.value = data.result.reports
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
    const data = response.data as ResponseData<AdminDashboardItem>
    if (!data || data.success === false) {
      return admin.error(`${GENERAL.FAILED_LOAD_DASHBOARD} (${data.error})`)
    }
    groups.value = data.result.groups
    boards.value = data.result.boards
    members.value = data.result.members
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
    days,
    height,
    loading,
    clearStatistics,
    today,
    loadStatistics,
    loadLatests,
    loadItems,
  }
})
