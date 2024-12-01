/**
 * store/user/user
 *
 * 정보 보기, 회원 관리 (관리자용) 관련 상태 및 함수들
 */

import { edenTreaty } from "@elysiajs/eden"
import { defineStore } from "pinia"
import { ref } from "vue"
import { USER_OPEN_INFO } from "../../../server/database/user/const"
import type { App } from "../../../server/index"
import { TSBOARD } from "../../../tsboard.config"
import { INIT_USER_BASIC, UserBasicInfo, UserOpenInfo } from "../../interface/user"
import { TEXT } from "../../messages/store/user/user"
import { useHomeStore } from "../home"
import { useUtilStore } from "../util"

export const useUserStore = defineStore("user", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const util = useUtilStore()
  const home = useHomeStore()
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
    const response = await client.tsapi.user.load.info.get({
      $query: {
        targetUserUid: targetUser.value.uid,
      },
    })

    if (!response.data) {
      return util.error(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.error(`${TEXT[home.lang].FAILED_LOAD_INFO} (${response.data.error})`)
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
