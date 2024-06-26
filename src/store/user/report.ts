/**
 * store/user/report
 *
 * 신고 관련 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../server/index"
import { useAuthStore } from "./auth"
import { useUtilStore } from "../util"
import { useHomeStore } from "../home"
import { INIT_USER_BASIC, UserBasicInfo } from "../../interface/user"
import { TEXT } from "../../messages/store/user/user"
import { TSBOARD } from "../../../tsboard.config"

export const useReportStore = defineStore("report", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const dialog = ref<boolean>(false)
  const content = ref<string>("")
  const checkedBlackList = ref<boolean>(false)
  const targetUser = ref<UserBasicInfo>(INIT_USER_BASIC)

  // 사용자 신고하기 다이얼로그 열기
  function openDialog(user: UserBasicInfo): void {
    targetUser.value = user
    dialog.value = true
  }

  // 사용자 신고하기 다이얼로그 닫기
  function closeDialog(): void {
    targetUser.value = INIT_USER_BASIC
    checkedBlackList.value = false
    dialog.value = false
  }

  // 운영진에게 특정 사용자 신고하기
  async function sendReport(): Promise<void> {
    if (targetUser.value.uid < 1) {
      return util.error(TEXT[home.lang].UNKNOWN_REPORT_TARGET)
    }
    if (content.value.length < 3 || content.value.length > 1000) {
      return util.error(TEXT[home.lang].INVALID_TEXT_LENGTH)
    }

    const response = await client.tsapi.user.report.post({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        userUid: auth.user.uid,
      },
      targetUserUid: targetUser.value.uid,
      content: content.value,
      checkedBlackList: checkedBlackList.value ? 1 : 0,
    })

    if (!response.data) {
      return util.error(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.error(`${TEXT[home.lang].FAILED_REPORT} (${response.data.error})`)
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    util.success(TEXT[home.lang].REPORTED_USER)
    closeDialog()
  }

  return {
    dialog,
    content,
    checkedBlackList,
    targetUser,
    openDialog,
    closeDialog,
    sendReport,
  }
})
