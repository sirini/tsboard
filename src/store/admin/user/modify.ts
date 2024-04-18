/**
 * store/admin/member/manager
 *
 * 회원 정보 수정에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../../server/index"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { UserModifyResult } from "../../../interface/auth"
import { MODIFY } from "../../../messages/store/admin/user/modify"
import { SHA256 } from "crypto-js"
import { USER_INFO } from "./const"
import { TSBOARD } from "../../../../tsboard.config"

export const useAdminUserModifyStore = defineStore("adminUserModifyStore", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const password = ref<string>("")
  const checkedPassword = ref<string>("")
  const user = ref<UserModifyResult>(USER_INFO)
  const newProfile = ref<File | undefined>(undefined)
  const newProfilePreview = ref<string>("")

  // 이름 중복 체크하기
  async function checkName(): Promise<void> {
    if (user.value.name.length < 2) {
      util.error(MODIFY.TOO_SHORT_NAME)
      return
    }
    const response = await client.tsapi.auth.checkname.post({
      name: user.value.name,
      userUid: user.value.uid,
    })
    if (!response.data) {
      util.error(MODIFY.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.error(`${user.value.name} ${MODIFY.DUPLICATED_NAME}`)
      return
    }
    util.success(`${user.value.name} ${MODIFY.VALID_NAME}`)
  }

  // 기존 회원 정보를 가져와 업데이트하기
  async function loadUserInfo(userUid: number): Promise<void> {
    const response = await client.tsapi.admin.user.load.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        userUid,
      },
    })
    if (!response.data) {
      admin.error(MODIFY.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      admin.error(`${MODIFY.FAILED_LOAD} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    user.value = response.data.result.user
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
    const response = await client.tsapi.admin.user.modify.patch({
      $headers: {
        authorization: auth.user.token,
      },
      userUid: user.value.uid,
      name: user.value.name,
      level: user.value.level,
      point: user.value.point,
      signature: user.value.signature,
      password: password.value.length > 0 ? SHA256(password.value).toString() : "",
      profile: newProfile.value,
    })
    if (!response.data) {
      admin.error(MODIFY.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      admin.error(`${MODIFY.FAILED_UPDATE} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
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
