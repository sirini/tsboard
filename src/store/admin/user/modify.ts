import { ref } from "vue"
import { defineStore } from "pinia"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { MODIFY } from "../../../messages/store/admin/user/modify"
import { SHA256 } from "crypto-js"
import { TSBOARD } from "../../../../tsboard.config"
import axios from "axios"
import { ADMIN_USER_INFO, AdminUserInfo } from "../../../interface/admin_interface"

export const useAdminUserModifyStore = defineStore("adminUserModifyStore", () => {
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const password = ref<string>("")
  const checkedPassword = ref<string>("")
  const user = ref<AdminUserInfo>(ADMIN_USER_INFO)
  const newProfile = ref<File | undefined>(undefined)
  const newProfilePreview = ref<string>("")

  // 이름 중복 체크하기
  async function checkName(): Promise<void> {
    if (user.value.name.length < 2) {
      util.error(MODIFY.TOO_SHORT_NAME)
      return
    }

    const fd = new FormData()
    fd.append("name", user.value.name)
    fd.append("userUid", user.value.uid.toString())

    const response = await axios.post(`${TSBOARD.API}/auth/checkname`, fd)

    if (!response.data) {
      return util.error(MODIFY.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.error(`${user.value.name} ${MODIFY.DUPLICATED_NAME}`)
    }
    util.success(`${user.value.name} ${MODIFY.VALID_NAME}`)
  }

  // 기존 회원 정보를 가져와 업데이트하기
  async function loadUserInfo(userUid: number): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/admin/user/load`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        userUid,
      },
    })

    if (!response.data) {
      return admin.error(MODIFY.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return admin.error(`${MODIFY.FAILED_LOAD} (${response.data.error})`)
    }

    user.value = response.data.result.user as AdminUserInfo
    admin.success(MODIFY.LOADED_USER)
  }

  // 변경할 프로필 사진 받기
  function selectProfileImage(event: Event): void {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return
    newProfile.value = input.files[0] as File
    newProfilePreview.value = URL.createObjectURL(newProfile.value)
  }

  // 회원 레벨 변경하기
  function changeUserLevel(level: number): void {
    user.value.level = level
  }

  // 변경된 사항 업데이트하기
  async function updateUserInfo(): Promise<void> {
    if (password.value.length > 0 || checkedPassword.value.length > 0) {
      if (password.value != checkedPassword.value) {
        util.error(MODIFY.DIFFERENT_PASSWORD)
        return
      }
    }

    const fd = new FormData()
    fd.append("userUid", user.value.uid.toString())
    fd.append("name", user.value.name)
    fd.append("level", user.value.level.toString())
    fd.append("point", user.value.point.toString())
    fd.append("signature", user.value.signature)
    fd.append("password", password.value.length > 0 ? SHA256(password.value).toString() : "")
    if (newProfile.value) {
      fd.append("profile", newProfile.value)
    }

    const response = await axios.patch(`${TSBOARD.API}/admin/user/modify`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${auth.user.token}`,
      },
    })

    if (!response.data) {
      return admin.error(MODIFY.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return admin.error(`${MODIFY.FAILED_UPDATE} (${response.data.error})`)
    }

    password.value = ""
    checkedPassword.value = ""
    newProfile.value = undefined
    newProfilePreview.value = ""
    util.success(`${user.value.name} ${MODIFY.UPDATED_USER}`)
    loadUserInfo(user.value.uid)
  }

  return {
    user,
    password,
    checkedPassword,
    newProfilePreview,
    checkName,
    loadUserInfo,
    selectProfileImage,
    changeUserLevel,
    updateUserInfo,
  }
})
