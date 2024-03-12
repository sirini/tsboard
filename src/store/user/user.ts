/**
 * store/user
 *
 * 신고, 정보 보기, 회원 관리 (관리자용) 관련 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../server/index"
import { useAuthStore } from "./auth"
import { useUtilStore } from "../util"
import { USER } from "../../messages/store/user/user"
import { UserOpenInfo } from "../../interface/user"
import { USER_OPEN_INFO } from "../../../server/database/user/const"

export const useUserStore = defineStore("user", () => {
  const server = edenTreaty<App>(process.env.API!)
  const auth = useAuthStore()
  const util = useUtilStore()
  const userInfoDialog = ref<boolean>(false)
  const sendReportDialog = ref<boolean>(false)
  const targetUserUid = ref<number>(0)
  const info = ref<UserOpenInfo>(USER_OPEN_INFO)

  // 사용자 정보 보기 다이얼로그 열기
  function openDialog(userUid: number): void {
    targetUserUid.value = userUid
    userInfoDialog.value = true

    loadUserInfo()
  }

  // 사용자 정보 보기 다이얼로그 닫기
  function closeDialog(): void {
    targetUserUid.value = 0
    userInfoDialog.value = false
  }

  // 사용자 신고하기 다이얼로그 열기
  function openSendReport(userUid: number): void {
    targetUserUid.value = userUid
    sendReportDialog.value = true
  }

  // 사용자 신고하기 다이얼로그 닫기
  function closeSendReport(): void {
    targetUserUid.value = 0
    sendReportDialog.value = false
  }

  // 운영진에게 특정 사용자 신고하기
  async function sendReport(report: string, blockNode: boolean, blockPost: boolean): Promise<void> {
    if (targetUserUid.value < 1) {
      util.error(USER.UNKNOWN_REPORT_TARGET)
      return
    }
    if (report.length < 3 || report.length > 1000) {
      util.error(USER.INVALID_TEXT_LENGTH)
      return
    }
    //do something
    util.success(USER.REPORTED_USER)
    setTimeout(closeSendReport, 2000)
  }

  // 회원 기본 정보 가져오기
  async function loadUserInfo(): Promise<void> {
    const response = await server.api.user.loaduserinfo.get({
      $query: {
        userUid: targetUserUid.value,
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
    userInfoDialog,
    sendReportDialog,
    info,
    openDialog,
    closeDialog,
    openSendReport,
    closeSendReport,
    sendReport,
    loadUserInfo,
  }
})
