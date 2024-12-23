import { ref } from "vue"
import { defineStore } from "pinia"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { LIST } from "../../../messages/store/admin/group/list"
import { TSBOARD } from "../../../../tsboard.config"
import axios from "axios"
import { AdminGroupConfig } from "../../../interface/admin_interface"
import { BoardWriter, Pair } from "../../../interface/board_interface"

export const useAdminGroupListStore = defineStore("adminGroupList", () => {
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const groups = ref<AdminGroupConfig[]>([])
  const removeGroupTarget = ref<Pair>({ uid: 0, name: "" })
  const confirmRemoveGroupDialog = ref<boolean>(false)
  const changeGroupIdDialog = ref<boolean>(false)
  const existGroupIds = ref<Pair[]>([])
  const newGroupId = ref<string>("")
  const changeGroupId = ref<string>("")
  const groupUid = ref<number>(0)

  // 그룹들 목록 가져오기
  async function loadGroupList(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/admin/group/list/load`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })

    if (!response.data) {
      return admin.error(LIST.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return admin.error(`${LIST.UNABLE_LOAD_LIST} (${response.data.error})`)
    }

    groups.value = response.data.result as AdminGroupConfig[]
  }

  // 새 그룹 생성을 위해 아이디를 입력할 때 기존 그룹 아이디를 보여주기
  async function _updateExistGroupIds(): Promise<void> {
    if (newGroupId.value.length < 2) {
      return
    }

    const response = await axios.get(`${TSBOARD.API}/admin/group/list/groupids`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        id: newGroupId.value,
        limit: 5,
      },
    })

    if (!response.data) {
      return admin.error(LIST.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return
    }
    if (response.data.result.length < 1) {
      existGroupIds.value = [{ uid: 0, name: LIST.NO_DUPLICATE_ID }]
      return
    }
    existGroupIds.value = response.data.result as Pair[]
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

    const response = await axios.post(
      `${TSBOARD.API}/admin/group/list/create/group`,
      {
        newId,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      },
    )

    if (!response.data) {
      return admin.error(LIST.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return admin.error(`${LIST.FAILED_CREATE_GROUP} (${response.data.error})`)
    }

    groups.value.push({
      uid: response.data.result.uid as number,
      id: response.data.result.id as string,
      count: 0,
      manager: response.data.result.manager as BoardWriter,
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
      return admin.error(LIST.MINIMUM_GROUP_COUNT)
    }

    const response = await axios.delete(`${TSBOARD.API}/admin/group/list/remove/group`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        groupUid: removeGroupTarget.value.uid,
      },
    })

    if (!response.data) {
      return admin.error(LIST.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return admin.error(`${LIST.FAILED_REMOVE_GROUP} (${response.data.error})`)
    }

    groups.value = groups.value.filter((group: AdminGroupConfig) => {
      return group.uid !== removeGroupTarget.value.uid
    })

    admin.success(LIST.REMOVED_GROUP)
    closeRemoveGroupDialog()
  }

  // 그룹 ID 변경하기 다이얼로그 띄우기
  function openChangeGroupIdDialog(uid: number, id: string): void {
    groupUid.value = uid
    changeGroupId.value = id
    changeGroupIdDialog.value = true
  }

  // 그룹 ID 변경하기 다이얼로그 닫기
  function closeChangeGroupIdDialog(): void {
    groupUid.value = 0
    changeGroupId.value = ""
    changeGroupIdDialog.value = false
  }

  // 그룹 ID 변경하기
  async function updateGroupId(): Promise<void> {
    const response = await axios.put(
      `${TSBOARD.API}/admin/group/list/update/group`,
      {
        groupUid: groupUid.value,
        changeGroupId: changeGroupId.value,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      },
    )

    if (!response.data) {
      return admin.error(LIST.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return admin.error(`${LIST.FAILED_UPDATE_GROUP_ID} (${response.data.error})`)
    }

    await loadGroupList()
    closeChangeGroupIdDialog()
  }

  return {
    groups,
    removeGroupTarget,
    confirmRemoveGroupDialog,
    changeGroupIdDialog,
    newGroupId,
    changeGroupId,
    groupUid,
    existGroupIds,
    loadGroupList,
    updateExistGroupIds,
    createNewGroup,
    confirmRemoveGroup,
    closeRemoveGroupDialog,
    removeGroup,
    openChangeGroupIdDialog,
    closeChangeGroupIdDialog,
    updateGroupId,
  }
})
