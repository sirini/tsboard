import { defineStore } from "pinia"
import { ref } from "vue"
import { TSBOARD } from "../../../tsboard.config"
import { TEXT } from "../../messages/store/user/user"
import { useHomeStore } from "../home"
import { useUtilStore } from "../util"
import axios from "axios"
import {
  USER_BASIC_INFO,
  USER_INFO_RESULT,
  UserBasicInfo,
  UserInfoResult,
} from "../../interface/user_interface"

export const useUserStore = defineStore("user", () => {
  const util = useUtilStore()
  const home = useHomeStore()
  const userInfoDialog = ref<boolean>(false)
  const targetUser = ref<UserBasicInfo>(USER_BASIC_INFO)
  const info = ref<UserInfoResult>(USER_INFO_RESULT)

  // 사용자 정보 보기 다이얼로그 열기
  function openDialog(user: UserBasicInfo): void {
    targetUser.value = user
    userInfoDialog.value = true
    loadUserInfo()
  }

  // 사용자 정보 보기 다이얼로그 닫기
  function closeDialog(): void {
    targetUser.value = USER_BASIC_INFO
    userInfoDialog.value = false
  }

  // 회원 기본 정보 가져오기
  async function loadUserInfo(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/user/load/info`, {
      params: {
        targetUserUid: targetUser.value.uid,
      },
    })

    if (!response.data) {
      return util.error(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.error(`${TEXT[home.lang].FAILED_LOAD_INFO} (${response.data.error})`)
    }

    info.value = response.data.result as UserInfoResult
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
