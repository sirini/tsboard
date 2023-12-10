/**
 * store/user.ts
 *
 * 쪽지, 신고, 정보 보기, 회원 관리 (관리자용) 관련 상태 및 유틸리티 함수들
 * 사용자 로그인 및 인증 관련은 auth store 참조
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { useUtilStore } from "./util"
import { TargetUserInfo, BlockFeature, ChatHistory } from "../interface/user"
import { useAuthStore } from "./auth"

export const useUserStore = defineStore("user", () => {
  const util = useUtilStore()
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

  // 사용자 관리하기 다이얼로그 열기
  function openManageUser(user: TargetUserInfo): void {
    targetUserInfo.value = user
    manageUserDialog.value = true
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
        util.alert("쪽지를 보낼 대상이 제대로 지정되지 않았습니다.")
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
      util.alert("신고할 대상이 제대로 지정되지 않았습니다.")
      return
    }
    if (report.length < 3 || report.length > 1000) {
      util.alert("신고 내용은 3글자 이상, 1000자 미만으로 작성해 주세요.")
      return
    }
    //do something
    util.alert(`${targetUserInfo.value.name} 님을 운영진에게 신고 하였습니다.`, "success")
    setTimeout(closeSendReport, 3000)
  }

  // 회원 관리하기
  async function manageUser(block: BlockFeature, report: string): Promise<void> {
    if (report.length < 3 || report.length > 1000) {
      util.alert("조치 사유는 3글자 이상, 1000자 미만으로 작성해 주세요.")
      return
    }
    // do something
    const w = block.writePost ? "글작성 차단" : "글작성 가능"
    const c = block.writeComment ? "댓글 작성 차단" : "댓글 작성 가능"
    const n = block.note ? "쪽지 차단" : "쪽지 가능"
    const r = block.report ? "신고 차단" : "신고 가능"
    const l = block.login ? "로그인 차단" : "로그인 가능"
    util.alert(
      `${targetUserInfo.value.name} 님에 대한 조치를 완료 하였습니다. (${w}, ${c}, ${n}, ${r}, ${l})`,
      "success",
    )
    setTimeout(closeManageUser, 3000)
  }

  return {
    targetUserInfo,
    userInfoDialog,
    sendNoteDialog,
    sendReportDialog,
    manageUserDialog,
    chatMessage,
    chatHistory,
    openUserInfo,
    closeUserInfo,
    openSendNote,
    closeSendNote,
    openSendReport,
    closeSendReport,
    openManageUser,
    closeManageUser,
    sendNote,
    sendReport,
    manageUser,
  }
})
