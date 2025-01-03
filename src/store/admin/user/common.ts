import { ref } from "vue"
import { defineStore } from "pinia"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../user/auth"
import { COMMON } from "../../../messages/store/admin/user/common"
import { TSBOARD } from "../../../../tsboard.config"
import axios from "axios"
import { AdminUserItem, AdminUserItemResult } from "../../../interface/admin_interface"
import { Pair, SEARCH, Search } from "../../../interface/board_interface"
import { CODE, ResponseData } from "../../../interface/util_interface"
import { ADMIN } from "../../../messages/store/admin/admin"

export const useAdminUserStore = defineStore("adminUser", () => {
  const admin = useAdminStore()
  const auth = useAuthStore()
  const blockUserTarget = ref<Pair>({ uid: 0, name: "" })
  const option = ref<Search>(SEARCH.USER.NAME as Search)
  const keyword = ref<string>("")
  const page = ref<number>(1)
  const pageLength = ref<number>(5)
  const bunch = ref<number>(10)
  const isBlocked = ref<boolean>(false)
  const users = ref<AdminUserItem[]>([])

  // 회원 목록 가져오기
  async function loadUsers(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/admin/user/list`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        page: page.value,
        bunch: bunch.value,
        isBlocked: isBlocked.value ? 1 : 0,
        option: option.value,
        keyword: encodeURIComponent(keyword.value),
      },
    })
    const data = response.data as ResponseData<AdminUserItemResult>
    if (!data || data.success === false) {
      if (data.code === CODE.INVALID_TOKEN && (await auth.updateAccessToken()) === true) {
        return admin.error(ADMIN.NEED_REFRESH)
      }
      return admin.error(`${COMMON.FAILED_LOAD} (${data.error})`)
    }

    pageLength.value = Math.ceil(data.result.maxUid / bunch.value)
    users.value = data.result.user
    admin.success(COMMON.LOADED_USER)
  }

  return {
    blockUserTarget,
    option,
    keyword,
    users,
    page,
    pageLength,
    bunch,
    isBlocked,
    loadUsers,
  }
})
