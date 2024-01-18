/**
 * store/admin/group/general
 *
 * 게시판 그룹 관리자 페이지에서 일반 부분에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../../server/index"
import { AdminPairItem, AdminGroupList, AdminGroupConfig } from "../../../interface/admin"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../../store/auth"
import { GENERAL } from "../../../messages/store/admin/group/general"

export const useAdminGroupGeneralStore = defineStore("adminGroupGeneral", () => {
  const route = useRoute()
  const server = edenTreaty<App>(process.env.API!)
  const admin = useAdminStore()
  const auth = useAuthStore()
  const group = ref<AdminGroupConfig>({
    uid: 0,
    id: "",
    count: 0,
    manager: {
      uid: 0,
      name: "",
    },
  })
  const removeBoardTarget = ref<AdminPairItem>({
    uid: 0,
    name: "",
  })
  const confirmRemoveBoardDialog = ref<boolean>(false)
  const boards = ref<AdminGroupList[]>([])
  const existBoardIds = ref<AdminGroupList[]>(boards.value)
  const dbresult = ref<AdminPairItem[]>([
    { uid: 1, name: "sample_user@test.com" },
    { uid: 2, name: "example_user@naver.com" },
    { uid: 3, name: "test_user_id@gmail.com" },
  ])
  const suggestions = ref<AdminPairItem[]>(dbresult.value)
  const newBoardId = ref<string>("")

  // 지정된 그룹의 설정값 불러오기
  async function loadGeneralConfig(): Promise<void> {
    const response = await server.api.admin.group.general.load.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: route.params.id as string,
      },
    })
    if (!response.data) {
      admin.error(GENERAL.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      admin.error(`${GENERAL.UNABLE_LOAD_GROUP_INFO} (${response.data.error})`)
      return
    }
    if (response.data.result.config.uid < 1) {
      admin.error(GENERAL.UNKNOWN_INFO)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken!)
    group.value = response.data.result.config as AdminGroupConfig
    boards.value = response.data.result.boards as AdminGroupList[]
    admin.success(GENERAL.LOADED_CONFIG)
  }

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

  // 새 게시판 생성을 위해 아이디를 입력할 때 기존 게시판 아이디를 보여주기
  async function updateExistBoardIds(): Promise<void> {
    if (newBoardId.value.length < 2) {
      return
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      existBoardIds.value = boards.value.filter((board: AdminGroupList) => {
        return board.id.indexOf(newBoardId.value) > -1
      })
    }, 200)
  }

  // 새 게시판 생성하기
  async function createNewBoard(): Promise<void> {
    const newId = newBoardId.value.trim()
    if (newId.length < 2) {
      admin.error(`게시판 ID는 2글자 이상 입력해 주세요.`)
      return
    }
    if (/^[a-z0-9_]{2,}$/.test(newId) === false) {
      admin.error(`게시판 ID는 영문자, 숫자, _ (밑줄)로만 작성할 수 있습니다.`)
      newBoardId.value = ""
      return
    }
    // do something
    boards.value.push({
      uid: 10,
      id: newId,
      name: "",
      info: "",
      manager: {
        uid: 0,
        name: "",
      },
    })
    admin.success(
      `${newId} 게시판이 성공적으로 추가 되었습니다. 상세 게시판 수정은 게시판 수정하기 기능을 이용해 주세요.`,
    )
    newBoardId.value = ""
  }

  // 선택한 회원을 그룹 관리자로 지정하기
  async function updateGroupManager(user: AdminPairItem): Promise<void> {
    // do something with user.uid, user.name
    group.value.manager.uid = user.uid
    group.value.manager.name = user.name
    admin.success(`${user.name} 님을 ${group.value.id} 그룹의 관리자로 지정 하였습니다.`)
  }

  // 게시판을 정말로 삭제할건지 확인하는 창 띄우기
  function confirmRemoveBoard(uid: number, id: string): void {
    removeBoardTarget.value.uid = uid
    removeBoardTarget.value.name = id
    confirmRemoveBoardDialog.value = true
  }

  // 게시판을 삭삭제하지 않고 그대로 닫기
  function closeRemoveBoardDialog(): void {
    removeBoardTarget.value.uid = 0
    removeBoardTarget.value.name = ""
    confirmRemoveBoardDialog.value = false
  }

  // 게시판을 정말로 삭제할 때 처리
  function removeBoard(): void {
    if (removeBoardTarget.value.uid < 1 || removeBoardTarget.value.name.length < 1) {
      admin.error("삭제할 게시판이 올바르게 지정되지 않았습니다.")
      return
    }
    // do something
    closeRemoveBoardDialog()
    admin.success("게시판이 성공적으로 삭제되었습니다.")
  }

  return {
    group,
    removeBoardTarget,
    confirmRemoveBoardDialog,
    boards,
    suggestions,
    newBoardId,
    existBoardIds,
    loadGeneralConfig,
    updateGroupManagerSuggestion,
    updateExistBoardIds,
    createNewBoard,
    updateGroupManager,
    confirmRemoveBoard,
    closeRemoveBoardDialog,
    removeBoard,
  }
})
