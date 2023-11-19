/**
 * store/auth.ts
 *
 * 로그인 등 사용자 관련 상태 및 유틸리티 함수들
 */

import { SHA256 } from "crypto-js"
import { ref } from "vue"
import { defineStore } from "pinia"
import { useUtilStore } from "./util"
import { User, TargetUserInfo } from "../interface/auth"

const INVALID_EMAIL = "이메일 주소 형식에 맞지 않습니다."
const INVALID_PASSWORD =
  "비밀번호는 8글자 이상, 숫자/대문자/특수문자를 각각 하나 이상 포함해야 합니다."
const INVALID_NICKNAME =
  "닉네임은 3글자 이상 입력해 주시고, 우측에 체크 아이콘을 눌러 중복 여부도 확인해보세요."

export const useAuthStore = defineStore("auth", () => {
  const util = useUtilStore()
  const userInfoDialog = ref<boolean>(false)
  const sendNoteDialog = ref<boolean>(false)
  const sendReportDialog = ref<boolean>(false)
  const targetUserInfo = ref<TargetUserInfo>({
    uid: 0,
    profile: "",
    name: "",
  })
  const user = ref<User>({
    uid: 0,
    id: "test@test.com",
    name: "tester",
    point: 100,
    level: 2,
    profile: "",
    signature: "",
    lastLogin: "2023-10-30 10:20:30",
    admin: true,
  })
  const id = ref<string>("")
  const password = ref<string>("")
  const checkedPassword = ref<string>("")
  const idForReset = ref<string>("")
  const nickname = ref<string>("")

  // 아이디(이메일) 입력란 체크
  const emailRule = [
    (value: any) => {
      if (util.filterEmail.test(value)) return true
      return INVALID_EMAIL
    },
  ]

  // 비밀번호 입력란 체크
  const passwordRule = [
    (value: any) => {
      if (util.filterPassword.test(value)) return true
      return INVALID_PASSWORD
    },
  ]

  // 닉네임 입력란 체크
  const nicknameRule = [
    (value: any) => {
      if (value?.length > 2) return true
      return INVALID_NICKNAME
    },
  ]

  // 사용자 로그인하기
  async function login(): Promise<void> {
    if (util.filterEmail.test(id.value) === false) {
      util.alert(INVALID_EMAIL)
      return
    }
    if (util.filterPassword.test(password.value) === false) {
      util.alert(INVALID_PASSWORD)
      return
    }
    const userId = id.value.trim()
    const userPass = SHA256(password.value)

    // TODO
    user.value.uid = 1
    user.value.name = "테스터"
    user.value.point = 1000
    user.value.level = 9
    user.value.profile = ""
    user.value.admin = true

    util.alert(`환영합니다, ${user.value.name}님!`, "success", 1000)

    setTimeout(() => {
      util.go("home")
    }, 1000)
  }

  // 사용자 로그아웃 하기
  async function logout(): Promise<void> {
    // TODO
    user.value.uid = 0
    user.value.name = ""
    user.value.point = 0
    user.value.level = 0
    user.value.profile = ""
    user.value.admin = false

    util.alert(`다음에 다시 뵐께요!`, "success")
  }

  // 비밀번호 초기화하기
  async function resetPassword(): Promise<void> {
    if (util.filterEmail.test(idForReset.value) === false) {
      util.alert(INVALID_EMAIL)
      return
    }
    // do something
    util.alert(`${idForReset.value}으로 비밀번호 초기화 메일을 발송하였습니다.`, "success")
  }

  // 닉네임 중복 체크하기
  async function checkNickname(): Promise<void> {
    if (user.value.name.length < 2) {
      util.alert(INVALID_NICKNAME)
    }
    // do something
    util.alert(`${user.value.name}은 사용할 수 있는 닉네임 입니다.`, "success")
  }

  // 가입 양식 제출받기
  async function signup(): Promise<void> {
    if (util.filterEmail.test(id.value) === false) {
      util.alert(INVALID_EMAIL)
      return
    }
    if (util.filterPassword.test(password.value) === false) {
      util.alert(INVALID_PASSWORD)
      return
    }
    if (nickname.value.length < 3) {
      util.alert(INVALID_NICKNAME)
      return
    }
    // do something
    util.alert(
      `${id.value}로 메일을 보내드렸습니다. 인증 메일 속 링크를 클릭하셔서 가입 절차를 완료하실 수 있습니다!`,
      "success",
    )

    setTimeout(() => {
      util.go("home")
    }, 5000)
  }

  // 내 정보 수정하기
  async function saveMyInfo(): Promise<void> {
    const nick = nickname.value.trim()
    if (nick.length < 2) {
      util.alert("닉네임은 2글자 이상 입력해 주세요.")
      return
    }
    if (password.value !== checkedPassword.value) {
      util.alert("입력하신 비밀번호가 서로 맞지 않습니다.")
      return
    }

    // do something
    util.alert("내 정보를 성공적으로 수정 하였습니다.", "success")
  }

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

  // 다른 사용자에게 쪽지 보내기
  async function sendNote(
    targetUserUid: number,
    targetUserName: string,
    note: string,
  ): Promise<void> {
    if (targetUserUid < 1) {
      util.alert("쪽지를 보낼 대상이 제대로 지정되지 않았습니다.")
      return
    }
    if (note.length < 3 || note.length > 1000) {
      util.alert("쪽지는 3글자 이상, 1000자 미만으로 작성해 주세요.")
      return
    }
    //do something
    util.alert(`${targetUserName} 님께 성공적으로 쪽지를 발송하였습니다.`, "success")
  }

  // 운영진에게 특정 사용자 신고하기
  async function sendReport(
    targetUserUid: number,
    targetUserName: string,
    report: string,
  ): Promise<void> {
    if (targetUserUid < 1) {
      util.alert("신고할 대상이 제대로 지정되지 않았습니다.")
      return
    }
    if (report.length < 3 || report.length > 1000) {
      util.alert("신고 내용은 3글자 이상, 1000자 미만으로 작성해 주세요.")
      return
    }
    //do something
    util.alert(`${targetUserName} 님을 운영진에게 신고 하였습니다.`, "success")
  }

  return {
    userInfoDialog,
    sendNoteDialog,
    sendReportDialog,
    targetUserInfo,
    user,
    id,
    password,
    checkedPassword,
    idForReset,
    nickname,
    emailRule,
    passwordRule,
    nicknameRule,
    login,
    logout,
    resetPassword,
    checkNickname,
    signup,
    saveMyInfo,
    openUserInfo,
    closeUserInfo,
    openSendNote,
    closeSendNote,
    sendNote,
    sendReport,
  }
})
