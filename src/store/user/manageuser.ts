import { ref } from "vue"
import { defineStore } from "pinia"
import { useUtilStore } from "../util"
import { useHomeStore } from "../home"
import { useAuthStore } from "./auth"
import { TEXT } from "../../messages/store/user/user"
import {
  USER_BASIC_INFO,
  USER_PERMISSION_REPORT_RESULT,
  UserBasicInfo,
  UserPermissionReportResult,
} from "../../interface/user_interface"
import axios from "axios"
import { TSBOARD } from "../../../tsboard.config"
import { CODE, ResponseData } from "../../interface/util_interface"
import { ADMIN } from "../../messages/store/admin/admin"

export const useManageUserStore = defineStore("manageuser", () => {
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const manageUserDialog = ref<boolean>(false)
  const targetUser = ref<UserBasicInfo>(USER_BASIC_INFO)
  const permission = ref<UserPermissionReportResult>(USER_PERMISSION_REPORT_RESULT)

  // 사용자 관리하기 다이얼로그 열기
  function openManageUser(user: UserBasicInfo): void {
    targetUser.value = user
    manageUserDialog.value = true
    loadUserPermission()
  }

  // 사용자 관리하기 다이얼로그 닫기
  function closeManageUser(): void {
    targetUser.value = USER_BASIC_INFO
    manageUserDialog.value = false
  }

  // 회원의 기존 권한들 불러오기
  async function loadUserPermission(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/user/load/permission`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        targetUserUid: targetUser.value.uid,
      },
    })
    const data = response.data as ResponseData<UserPermissionReportResult>
    if (!data || data.success === false) {
      if (data.code === CODE.INVALID_TOKEN && (await auth.updateAccessToken()) === true) {
        util.error(ADMIN.NEED_REFRESH)
      }
      return util.error(`${TEXT[home.lang].FAILED_LOAD_PERMISSION} (${data.error})`)
    }
    permission.value = data.result
    util.success(TEXT[home.lang].LOADED_PERMISSION)
  }

  // 회원 관리하기
  async function manageUser(): Promise<void> {
    if (permission.value.response.length < 3 || permission.value.response.length > 1000) {
      return util.error(TEXT[home.lang].INVALID_TEXT_LENGTH)
    }

    const fd = new FormData()
    fd.append("targetUserUid", targetUser.value.uid.toString())
    fd.append("writePost", permission.value.writePost ? "1" : "0")
    fd.append("writeComment", permission.value.writeComment ? "1" : "0")
    fd.append("sendChatMessage", permission.value.sendChatMessage ? "1" : "0")
    fd.append("sendReport", permission.value.sendReport ? "1" : "0")
    fd.append("response", permission.value.response)

    const response = await axios.post(`${TSBOARD.API}/user/manage/user`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return util.error(`${TEXT[home.lang].FAILED_MANAGE_USER} (${data.error})`)
    }

    util.success(TEXT[home.lang].ACTION_TAKEN)
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
