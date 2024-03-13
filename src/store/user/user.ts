/**
 * store/user/user
 *
 * 정보 보기, 회원 관리 (관리자용) 관련 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../server/index"
import { useAuthStore } from "./auth"
import { useUtilStore } from "../util"
import { USER } from "../../messages/store/user/user"
import { INIT_USER_BASIC, UserBasicInfo, UserOpenInfo } from "../../interface/user"
import { USER_OPEN_INFO } from "../../../server/database/user/const"

export const useUserStore = defineStore("user", () => {
  const server = edenTreaty<App>(process.env.API!)
  const auth = useAuthStore()
  const util = useUtilStore()
  const userInfoDialog = ref<boolean>(false)
  const targetUser = ref<UserBasicInfo>(INIT_USER_BASIC)
  const info = ref<UserOpenInfo>(USER_OPEN_INFO)

  // 사용자 정보 보기 다이얼로그 열기
  function openDialog(user: UserBasicInfo): void {
    targetUser.value = user
    userInfoDialog.value = true

    loadUserInfo()
  }

  // 사용자 정보 보기 다이얼로그 닫기
  function closeDialog(): void {
    targetUser.value = INIT_USER_BASIC
    userInfoDialog.value = false
  }

  // 회원 기본 정보 가져오기
  async function loadUserInfo(): Promise<void> {
    const response = await server.api.user.loaduserinfo.get({
      $query: {
        userUid: targetUser.value.uid,
      },
    })

    if (!response.data) {
      util.error(USER.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.error(`${USER.FAILED_LOAD_INFO} (${response.data.error})`)
      return
    }

    info.value = response.data.result
  }

  return {
    targetUser,
    userInfoDialog,
    info,
    openDialog,
    closeDialog,
    loadUserInfo,
  }
})
