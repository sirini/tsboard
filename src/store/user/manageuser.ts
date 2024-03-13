/**
 * store/manageuser
 *
 * 회원 관리 (관리자용) 관련 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../server/index"
import { useUtilStore } from "../util"
import { INIT_USER_BASIC, UserBasicInfo, UserPermissionParams } from "../../interface/user"
import { useAuthStore } from "./auth"
import { USER } from "../../messages/store/user/user"
import { INIT_PERMISSION } from "./const"

export const useManageUserStore = defineStore("manageuser", () => {
  const server = edenTreaty<App>(process.env.API!)
  const auth = useAuthStore()
  const util = useUtilStore()
  const manageUserDialog = ref<boolean>(false)
  const targetUser = ref<UserBasicInfo>(INIT_USER_BASIC)
  const permission = ref<UserPermissionParams>(INIT_PERMISSION)

  // 사용자 관리하기 다이얼로그 열기
  function openManageUser(user: UserBasicInfo): void {
    targetUser.value = user
    manageUserDialog.value = true
    loadUserPermission()
  }

  // 사용자 관리하기 다이얼로그 닫기
  function closeManageUser(): void {
    targetUser.value = INIT_USER_BASIC
    manageUserDialog.value = false
  }

  // 회원의 기존 권한들 불러오기
  async function loadUserPermission(): Promise<void> {
    const response = await server.api.user.loadpermission.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        userUid: targetUser.value.uid,
      },
    })
    if (!response.data) {
      util.error(USER.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.error(`${USER.FAILED_LOAD_PERMISSION} (${response.data.error})`)
      return
    }
    permission.value = response.data.result.permission
    util.success(USER.LOADED_PERMISSION)
  }

  // 회원 관리하기
  async function manageUser(): Promise<void> {
    if (permission.value.response.length < 3 || permission.value.response.length > 1000) {
      util.error(USER.INVALID_TEXT_LENGTH)
      return
    }
    const response = await server.api.user.manageuser.post({
      $headers: {
        authorization: auth.user.token,
      },
      userUid: targetUser.value.uid,
      writePost: permission.value.writePost,
      writeComment: permission.value.writeComment,
      sendChatMessage: permission.value.sendChatMessage,
      sendReport: permission.value.sendReport,
      login: permission.value.login,
      response: permission.value.response,
    })
    if (!response.data) {
      util.error(USER.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.error(`${USER.FAILED_MANAGE_USER} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    util.success(USER.ACTION_TAKEN)
    closeManageUser()
  }

  return {
    targetUser,
    manageUserDialog,
    permission,
    openManageUser,
    closeManageUser,
    loadUserPermission,
    manageUser,
  }
})
