/**
 * store/admin/report/waiting
 *
 * 신고 내역 조회 및 조치에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../../server/index"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { AdminReport } from "../../../interface/admin"
import { COMMON } from "../../../messages/store/admin/report/common"
import { TSBOARD } from "../../../../tsboard.config"

export const useAdminReportStore = defineStore("adminReport", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const isSolved = ref<boolean>(false)
  const option = ref<"from" | "request" | "to">("request")
  const keyword = ref<string>("")
  const page = ref<number>(1)
  const pageLength = ref<number>(5)
  const bunch = ref<number>(10)
  const reports = ref<AdminReport[]>([])

  // 신고 목록 가져오기
  async function loadReports(): Promise<void> {
    const response = await client.tsapi.admin.report.list.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        page: page.value,
        bunch: bunch.value,
        isSolved: isSolved.value ? 1 : 0,
      },
    })
    if (!response.data) {
      admin.error(COMMON.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      admin.error(`${COMMON.FAILED_LOAD} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    pageLength.value = Math.ceil(response.data.result.maxReportUid / bunch.value)
    reports.value = response.data.result.reports
    admin.success(COMMON.LOADED_REPORT)
  }

  // 검색어 지우고 목록 초기화하기
  async function resetKeyword(): Promise<void> {
    keyword.value = ""
    loadReports()
  }

  // 검색어 입력하면 반응하기
  async function _updateReports(): Promise<void> {
    if (keyword.value.length < 2) {
      return
    }
    const response = await client.tsapi.admin.report.search.list.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        option: option.value,
        keyword: keyword.value,
        page: page.value,
        bunch: bunch.value,
        isSolved: isSolved.value ? 1 : 0,
      },
    })
    if (!response.data) {
      admin.error(COMMON.NO_RESPONSE)
      return
    }
    pageLength.value = Math.ceil(response.data.result.maxReportUid / bunch.value)
    reports.value = response.data.result.reports
  }
  const updateReports = util.debounce(_updateReports, 250)

  return {
    isSolved,
    option,
    keyword,
    page,
    pageLength,
    bunch,
    reports,
    loadReports,
    resetKeyword,
    updateReports,
  }
})
