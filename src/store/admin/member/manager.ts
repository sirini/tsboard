/**
 * store/admin/member/manager
 *
 * 회원 정보 수정에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { useUtilStore } from "../../util"
import { User } from "../../../interface/auth"

export const useAdminMemberManagerStore = defineStore("adminMemberManager", () => {
  const util = useUtilStore()
  const password = ref<string>("")
  const checkedPassword = ref<string>("")
  const user = ref<User>({
    uid: 1,
    id: "test@test.com",
    name: "tester",
    profile: "/no-profile.png",
    level: 2,
    point: 100,
    signature: "learning by building something",
    signup: 0,
    signin: 0,
    admin: true,
    token: "",
  })

  // 이름 중복 체크하기
  async function checkName(): Promise<void> {
    if (user.value.name.length < 2) {
      util.error(`이름이 너무 짧습니다. 2글자 이상 입력해 주세요.`)
      return
    }
    // do something
    util.success(`${user.value.name}은 사용할 수 있는 이름입니다.`)
  }

  // 기존 회원 정보를 가져와 업데이트하기
  async function loadUserInfo(uid: number): Promise<void> {
    // do something
    user.value.uid = uid
  }

  // 회원 레벨 변경하기
  function changeUserLevel(level: number): void {
    user.value.level = level
  }

  // 변경된 사항 업데이트하기
  async function updateUserInfo(): Promise<void> {
    if (password.value.length > 0 || checkedPassword.value.length > 0) {
      if (password.value != checkedPassword.value) {
        util.error("입력하신 비밀번호가 서로 다릅니다. 다시 확인해 주세요.")
        return
      }
    }
    // do something
    password.value = ""
    checkedPassword.value = ""
    util.success(`${user.value.name}님의 정보를 업데이트 하였습니다.`)
  }

  return {
    user,
    password,
    checkedPassword,
    checkName,
    loadUserInfo,
    changeUserLevel,
    updateUserInfo,
  }
})
