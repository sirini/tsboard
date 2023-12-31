/**
 * store/admin/group/list
 *
 * 게시판 그룹 목록 관리에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminPairItem, AdminGroupConfig } from "../../../interface/admin"
import { useAdminStore } from "../common"

export const useAdminGroupListStore = defineStore("adminGroupList", () => {
  const admin = useAdminStore()
  const groups = ref<AdminGroupConfig[]>([
    { uid: 1, id: "default", count: 3, manager: { uid: 2, name: "admin_sample@test.com" } },
    { uid: 2, id: "sample", count: 2, manager: { uid: 5, name: "admin8@user.com" } },
    { uid: 3, id: "test", count: 1, manager: { uid: 6, name: "olduser@example.com" } },
  ])
  const removeGroupTarget = ref<AdminPairItem>({
    uid: 0,
    name: "",
  })
  const confirmRemoveGroupDialog = ref<boolean>(false)
  const existGroupIds = ref<AdminGroupConfig[]>(groups.value)
  const newGroupId = ref<string>("")

  // 새 그룹 생성을 위해 아이디를 입력할 때 기존 그룹 아이디를 보여주기
  let timer: any = null
  async function updateExistGroupIds(): Promise<void> {
    if (newGroupId.value.length < 2) {
      return
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      existGroupIds.value = groups.value.filter((group: AdminGroupConfig) => {
        return group.id.indexOf(newGroupId.value) > -1
      })
    }, 200)
  }

  // 새 그룹 생성하기
  async function createNewGroup(): Promise<void> {
    const newId = newGroupId.value.trim()
    if (newId.length < 2) {
      admin.error(`그룹 ID는 2글자 이상 입력해 주세요`)
      return
    }
    if (/^[a-z0-9_]{2,}$/.test(newId) === false) {
      admin.error(`그룹 ID는 영어 소문자, 숫자, _ (밑줄)로만 작성할 수 있습니다.`)
      newGroupId.value = ""
      return
    }
    // do something
    groups.value.push({
      uid: 10,
      id: newId,
      count: 0,
      manager: { uid: 0, name: "" },
    })
    admin.success(
      `${newId} 그룹이 성공적으로 추가 되었습니다. 상세 그룹 수정은 그룹 수정하기 기능을 이용해 주세요.`,
    )
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
    if (removeGroupTarget.value.uid < 2) {
      admin.error("기본 그룹은 삭제할 수 없습니다.")
      return
    }
    // do something with uid
    groups.value = groups.value.filter((group: AdminGroupConfig) => {
      return group.uid !== removeGroupTarget.value.uid
    })
    admin.success(
      "선택하신 그룹을 성공적으로 삭제하고, 대상 글들의 카테고리를 기본으로 옮겼습니다.",
    )
    closeRemoveGroupDialog()
  }

  return {
    groups,
    removeGroupTarget,
    confirmRemoveGroupDialog,
    newGroupId,
    existGroupIds,
    updateExistGroupIds,
    createNewGroup,
    confirmRemoveGroup,
    closeRemoveGroupDialog,
    removeGroup,
  }
})
