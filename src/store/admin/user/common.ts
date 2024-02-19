/**
 * store/admin/member/general
 *
 * 회원 목록 관리자 페이지에서 일반 부분에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../../server/index"
import { AdminUser, AdminPair, AdminReport } from "../../../interface/admin"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../user/auth"
import { COMMON } from "../../../messages/store/admin/user/common"

export const useAdminUserStore = defineStore("adminUser", () => {
  const server = edenTreaty<App>(process.env.API!)
  const admin = useAdminStore()
  const auth = useAuthStore()
  const blockUserTarget = ref<AdminPair>({ uid: 0, name: "" })
  const option = ref<"name" | "id" | "level">("name")
  const keyword = ref<string>("")
  const page = ref<number>(1)
  const pageLength = ref<number>(5)
  const bunch = ref<number>(10)
  const isBlocked = ref<boolean>(false)
  const users = ref<AdminUser[]>([])

  // 회원 목록 가져오기
  async function loadUsers(): Promise<void> {
    const response = await server.api.admin.user.list.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        page: page.value,
        bunch: bunch.value,
        isBlocked: isBlocked.value ? 1 : 0,
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
    pageLength.value = Math.ceil(response.data.result.totalUserCount / bunch.value)
    users.value = response.data.result.users
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
