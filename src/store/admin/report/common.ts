import { ref } from "vue"
import { defineStore } from "pinia"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { COMMON } from "../../../messages/store/admin/report/common"
import { TSBOARD } from "../../../../tsboard.config"
import { AdminReportItem, AdminReportResult } from "../../../interface/admin_interface"
import axios from "axios"
import { SEARCH, Search } from "../../../interface/board_interface"
import { CODE, ResponseData } from "../../../interface/util_interface"
import { ADMIN } from "../../../messages/store/admin/admin"

export const useAdminReportStore = defineStore("adminReport", () => {
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const isSolved = ref<boolean>(false)
  const option = ref<Search>(SEARCH.REPORT.FROM as Search)
  const keyword = ref<string>("")
  const page = ref<number>(1)
  const pageLength = ref<number>(5)
  const bunch = ref<number>(10)
  const reports = ref<AdminReportItem[]>([])

  // 신고 목록 가져오기
  async function loadReports(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/admin/report/list`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        page: page.value,
        bunch: bunch.value,
        isSolved: isSolved.value ? 1 : 0,
      },
    })
    const data = response.data as ResponseData<AdminReportResult>
    if (!data || data.success === false) {
      if (data.code === CODE.INVALID_TOKEN && (await auth.updateAccessToken()) === true) {
        return admin.error(ADMIN.NEED_REFRESH)
      }
      return admin.error(`${COMMON.FAILED_LOAD} (${data.error})`)
    }

    pageLength.value = Math.ceil(data.result.maxUid / bunch.value)
    reports.value = data.result.reports
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

    const response = await axios.get(`${TSBOARD.API}/admin/report/search/list`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        option: option.value,
        keyword: encodeURIComponent(keyword.value),
        page: page.value,
        bunch: bunch.value,
        isSolved: isSolved.value ? 1 : 0,
      },
    })
    const data = response.data as ResponseData<AdminReportResult>
    if (!data || data.success === false) {
      return admin.error(COMMON.NO_RESPONSE)
    }

    pageLength.value = Math.ceil(data.result.maxUid / bunch.value)
    reports.value = data.result.reports
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
