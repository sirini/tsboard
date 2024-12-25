import { ref } from "vue"
import { defineStore } from "pinia"
import { useAuthStore } from "./auth"
import { useUtilStore } from "../util"
import { useHomeStore } from "../home"
import { TEXT } from "../../messages/store/user/user"
import { TSBOARD } from "../../../tsboard.config"
import { USER_BASIC_INFO, UserBasicInfo } from "../../interface/user_interface"
import axios from "axios"

export const useReportStore = defineStore("report", () => {
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const dialog = ref<boolean>(false)
  const content = ref<string>("")
  const checkedBlackList = ref<boolean>(false)
  const targetUser = ref<UserBasicInfo>(USER_BASIC_INFO)

  // 사용자 신고하기 다이얼로그 열기
  function openDialog(user: UserBasicInfo): void {
    targetUser.value = user
    dialog.value = true
  }

  // 사용자 신고하기 다이얼로그 닫기
  function closeDialog(): void {
    targetUser.value = USER_BASIC_INFO
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

    const fd = new FormData()
    fd.append("targetUserUid", targetUser.value.uid.toString())
    fd.append("content", content.value)
    fd.append("checkedBlackList", checkedBlackList.value ? "1" : "0")

    const response = await axios.post(
      `${TSBOARD.API}/user/report`, fd,
      {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      },
    )

    if (!response.data) {
      return util.error(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.error(`${TEXT[home.lang].FAILED_REPORT} (${response.data.error})`)
    }

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
