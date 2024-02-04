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
import { AdminDashboardStat } from "../../../interface/admin"
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
    const response = await server.api.admin.dashboard.general.load.get({
      $headers: {
        authorization: auth.user.token,
      },
    })
    if (!response.data) {
      admin.error(GENERAL.NO_RESPONSE)
      return
    }
    visit.value = response.data.result.visit as AdminDashboardStat
    member.value = response.data.result.member as AdminDashboardStat
    post.value = response.data.result.post as AdminDashboardStat
  }

  return {
    visit,
    member,
    post,
    today,
    loadStatistics,
  }
})
