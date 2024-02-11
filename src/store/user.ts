/**
 * store/user
 *
 * 쪽지, 신고, 정보 보기, 회원 관리 (관리자용) 관련 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../server/index"
import { useAdminStore } from "./admin/common"
import { TargetUserInfo, ChatHistory, UserPermissionParams } from "../interface/user"
import { useAuthStore } from "./auth"
import { USER } from "../messages/store/user"

export const useUserStore = defineStore("user", () => {
  const server = edenTreaty<App>(process.env.API!)
  const admin = useAdminStore()
  const auth = useAuthStore()
  const userInfoDialog = ref<boolean>(false)
  const sendNoteDialog = ref<boolean>(false)
  const sendReportDialog = ref<boolean>(false)
  const manageUserDialog = ref<boolean>(false)
  const targetUserInfo = ref<TargetUserInfo>({
    uid: 0,
    profile: "",
    name: "",
  })

  // 사용자 정보 보기 다이얼로그 열기
  function openUserInfo(user: TargetUserInfo): void {
    targetUserInfo.value = user
    userInfoDialog.value = true
  }

  // 사용자 정보 보기 다이얼로그 닫기
  function closeUserInfo(): void {
    targetUserInfo.value = { uid: 0, profile: "", name: "" }
    userInfoDialog.value = false
  }

  // 쪽지 보내기 다이얼로그 열기
  function openSendNote(user: TargetUserInfo): void {
    targetUserInfo.value = user
    sendNoteDialog.value = true
  }

  // 쪽지 보내기 다이얼로그 닫기
  function closeSendNote(): void {
    targetUserInfo.value = { uid: 0, profile: "", name: "" }
    sendNoteDialog.value = false
  }

  // 사용자 신고하기 다이얼로그 열기
  function openSendReport(user: TargetUserInfo): void {
    targetUserInfo.value = user
    sendReportDialog.value = true
  }

  // 사용자 신고하기 다이얼로그 닫기
  function closeSendReport(): void {
    targetUserInfo.value = { uid: 0, profile: "", name: "" }
    sendReportDialog.value = false
  }

  // 사용자 관리하기 다이얼로그 닫기
  function closeManageUser(): void {
    targetUserInfo.value = { uid: 0, profile: "", name: "" }
    manageUserDialog.value = false
  }

  // 다른 사용자에게 쪽지 보내기
  let chatTimer: any = null
  const chatDelay = 300
  const chatMessage = ref<string>("")
  const chatHistory = ref<ChatHistory[]>([])

  async function sendNote(): Promise<void> {
    clearTimeout(chatTimer)
    chatTimer = setTimeout(() => {
      if (targetUserInfo.value.uid < 1) {
        admin.error(USER.UNKNOWN_NOTE_TARGET)
        return
      }
      if (chatMessage.value.length < 2) {
        return
      }
      //do something
      chatHistory.value.push({
        userUid: auth.user.uid,
        message: chatMessage.value,
      })
      chatMessage.value = ""
    }, chatDelay)
  }

  // 운영진에게 특정 사용자 신고하기
  async function sendReport(report: string, blockNode: boolean, blockPost: boolean): Promise<void> {
    if (targetUserInfo.value.uid < 1) {
      admin.error(USER.UNKNOWN_REPORT_TARGET)
      return
    }
    if (report.length < 3 || report.length > 1000) {
      admin.error(USER.INVALID_TEXT_LENGTH)
      return
    }
    //do something
    admin.success(`${targetUserInfo.value.name} ${USER.REPORTED_USER}`)
    setTimeout(closeSendReport, 3000)
  }

  return {
    targetUserInfo,
    userInfoDialog,
    sendNoteDialog,
    sendReportDialog,
    chatMessage,
    chatHistory,
    openUserInfo,
    closeUserInfo,
    openSendNote,
    closeSendNote,
    openSendReport,
    closeSendReport,
    sendNote,
    sendReport,
  }
})
