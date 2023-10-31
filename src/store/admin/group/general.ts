/**
 * store/admin/group/general.ts
 *
 * 게시판 그룹 관리자 페이지에서 일반 부분에 필요한 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminPairItem, AdminGroupList, AdminGroupConfig } from "../../../interface/admin"
import { useAdminStore } from "../common"

export const useAdminGroupGeneralStore = defineStore("adminGroupGeneral", () => {
  const admin = useAdminStore()
  const group = ref<AdminGroupConfig>({
    uid: 1,
    id: "default",
    manager: {
      uid: 11,
      name: "admin_sample@test.com",
    },
  })
  const removeBoardTarget = ref<AdminPairItem>({
    uid: 0,
    name: "",
  })
  const confirmRemoveBoardDialog = ref<boolean>(false)
  const boards = ref<AdminGroupList[]>([
    { uid: 1, id: "test", info: "테스트용 게시판 입니다.", admin: "master01_sample@test.com" },
    { uid: 2, id: "test2", info: "테스트용 게시판 2 입니다.", admin: "master02@naver.com" },
    { uid: 3, id: "free", info: "자유롭게 얘기 나눌 수 있는 게시판입니다.", admin: "master03.lab@tsboard.dev" },
  ])
  const dbresult = ref<AdminPairItem[]>([
    { uid: 1, name: "sample_user@test.com" },
    { uid: 2, name: "example_user@naver.com" },
    { uid: 3, name: "test_user_id@gmail.com" },
    { uid: 4, name: "abc@studio.net" },
    { uid: 5, name: "zflip5@samsung.com" },
  ])
  const suggestions = ref<AdminPairItem[]>(dbresult.value)

  // 회원 아이디를 입력할 때마다 하단에 검색해서 보여주기
  let timer: any = null
  async function updateGroupManagerSuggestion(): Promise<void> {
    // do something with group.value.manager.name
    clearTimeout(timer)
    timer = setTimeout(() => {
      suggestions.value = dbresult.value.filter((user: AdminPairItem) => {
        return user.name.indexOf(group.value.manager.name) > -1
      })
    }, 200)
  }

  // 선택한 회원을 그룹 관리자로 지정하기
  async function updateGroupManager(user: AdminPairItem): Promise<void> {
    // do something with user.uid, user.name
    group.value.manager.uid = user.uid
    group.value.manager.name = user.name
    admin.snack(
      `${user.name} 님을 ${group.value.id} 그룹의 관리자로 지정 하였습니다.`,
      "success",
    )
  }

  // 게시판을 정말로 삭제할건지 확인하는 창 띄우기
  function confirmRemoveBoard(uid: number, id: string): void {
    removeBoardTarget.value.uid = uid
    removeBoardTarget.value.name = id
    confirmRemoveBoardDialog.value = true
  }

  // 게시판을 정말로 삭제할 때 처리
  function removeBoard(): void {
    if (removeBoardTarget.value.uid < 1 || removeBoardTarget.value.name.length < 1) {
      admin.snack("삭제할 게시판이 올바르게 지정되지 않았습니다.", "error")
      return
    }
    // do something
    removeBoardTarget.value.uid = 0
    removeBoardTarget.value.name = ""
    confirmRemoveBoardDialog.value = false
    admin.snack("게시판이 성공적으로 삭제되었습니다.", "success")
  }

  return {
    group,
    removeBoardTarget,
    confirmRemoveBoardDialog,
    boards,
    suggestions,
    updateGroupManagerSuggestion,
    updateGroupManager,
    confirmRemoveBoard,
    removeBoard,
  }
})
