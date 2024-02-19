/**
 * store/admin/group/list
 *
 * 게시판 그룹 목록 관리에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../../server/index"
import { AdminPair, AdminGroupConfig, AdminUserInfo } from "../../../interface/admin"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { LIST } from "../../../messages/store/admin/group/list"

export const useAdminGroupListStore = defineStore("adminGroupList", () => {
  const server = edenTreaty<App>(process.env.API!)
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const groups = ref<AdminGroupConfig[]>([])
  const removeGroupTarget = ref<AdminPair>({
    uid: 0,
    name: "",
  })
  const confirmRemoveGroupDialog = ref<boolean>(false)
  const existGroupIds = ref<AdminPair[]>([])
  const newGroupId = ref<string>("")

  // 그룹들 목록 가져오기
  async function loadGroupList(): Promise<void> {
    const response = await server.api.admin.group.list.load.get({
      $headers: {
        authorization: auth.user.token,
      },
    })
    if (!response.data) {
      admin.error(LIST.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      admin.error(`${LIST.UNABLE_LOAD_LIST} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    groups.value = response.data.result.groups
  }

  // 새 그룹 생성을 위해 아이디를 입력할 때 기존 그룹 아이디를 보여주기
  async function _updateExistGroupIds(): Promise<void> {
    if (newGroupId.value.length < 2) {
      return
    }
    const response = await server.api.admin.group.list.groupids.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: newGroupId.value,
        limit: 5,
      },
    })
    if (!response.data) {
      admin.error(LIST.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      return
    }
    if (response.data.result.ids.length < 1) {
      existGroupIds.value = [{ uid: 0, name: LIST.NO_DUPLICATE_ID }]
      return
    }
    existGroupIds.value = response.data.result.ids
  }
  const updateExistGroupIds = util.debounce(_updateExistGroupIds, 250)

  // 새 그룹 생성하기
  async function createNewGroup(): Promise<void> {
    const newId = newGroupId.value.trim()
    if (newId.length < 2) {
      admin.error(LIST.TOO_SHORT_GROUP_ID)
      return
    }
    if (/^[a-z0-9_]{2,}$/.test(newId) === false) {
      admin.error(LIST.INVALID_GROUP_ID)
      newGroupId.value = ""
      return
    }
    const response = await server.api.admin.group.list.creategroup.post({
      $headers: {
        authorization: auth.user.token,
      },
      newId,
    })
    if (!response.data) {
      admin.error(LIST.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      admin.error(`${LIST.FAILED_CREATE_GROUP} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    groups.value.push({
      uid: response.data.result.uid,
      id: newId,
      count: 0,
      manager: response.data.result.manager,
    })
    admin.success(LIST.ADDED_NEW_GROUP)
    newGroupId.value = ""
  }

  // 그룹 삭제하기 확인
  function confirmRemoveGroup(uid: number, id: string): void {
    removeGroupTarget.value.uid = uid
    removeGroupTarget.value.name = id
    confirmRemoveGroupDialog.value = true
  }

  // 그룹 삭제하지 않고 그냥 닫기
  function closeRemoveGroupDialog(): void {
    removeGroupTarget.value = {
      uid: 0,
      name: "",
    }
    confirmRemoveGroupDialog.value = false
  }

  // 그룹 삭제하기
  async function removeGroup(): Promise<void> {
    if (groups.value.length < 2) {
      admin.error(LIST.MINIMUM_GROUP_COUNT)
      return
    }
    const response = await server.api.admin.group.list.removegroup.delete({
      $headers: {
        authorization: auth.user.token,
      },
      groupUid: removeGroupTarget.value.uid,
    })
    if (!response.data) {
      admin.error(LIST.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      admin.error(`${LIST.FAILED_REMOVE_GROUP} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)

    groups.value = groups.value.filter((group: AdminGroupConfig) => {
      return group.uid !== removeGroupTarget.value.uid
    })
    admin.success(LIST.status_GROUP)
    closeRemoveGroupDialog()
  }

  return {
    groups,
    removeGroupTarget,
    confirmRemoveGroupDialog,
    newGroupId,
    existGroupIds,
    loadGroupList,
    updateExistGroupIds,
    createNewGroup,
    confirmRemoveGroup,
    closeRemoveGroupDialog,
    removeGroup,
  }
})
