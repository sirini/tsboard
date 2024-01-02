/**
 * store/admin/board/permission
 *
 * 게시판 관리자 페이지에서 권한 부분에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminPairItem, AdminUserActivity } from "../../../interface/admin"
import { useAdminStore } from "../common"
import { useAdminBoardGeneralStore } from "./general"

export const useAdminBoardPermissionStore = defineStore("adminBoardPermission", () => {
  const admin = useAdminStore()
  const general = useAdminBoardGeneralStore()
  const manager = ref<AdminPairItem>({
    uid: 0,
    name: "" /* userid@example.com */,
  })
  const dbresult = ref<AdminPairItem[]>([
    { uid: 1, name: "sample_user@test.com" },
    { uid: 2, name: "example_user@naver.com" },
    { uid: 3, name: "test_user_id@gmail.com" },
    { uid: 4, name: "abc@studio.net" },
    { uid: 5, name: "zflip5@samsung.com" },
  ])
  const suggestions = ref<AdminPairItem[]>(dbresult.value)
  const access = ref<AdminUserActivity>({
    list: 0,
    view: 0,
    write: 1,
    comment: 1,
    download: 1,
  })

  // 회원 아이디를 입력할 때마다 하단에 검색해서 보여주기
  let timer: any = null
  async function updateBoardManagerSuggestion(): Promise<void> {
    // do something with manager.value.name
    clearTimeout(timer)
    timer = setTimeout(() => {
      suggestions.value = dbresult.value.filter((user: AdminPairItem) => {
        return user.name.indexOf(manager.value.name) > -1
      })
    }, 200)
  }

  // 선택한 회원을 관리자로 지정하기
  async function updateBoardManager(user?: AdminPairItem): Promise<void> {
    if (user === undefined) {
      manager.value.uid = 0
      manager.value.name = ""
      admin.snack(`게시판 관리자를 따로 지정하지 않습니다.`, "success")
      return
    }

    // do something with user.uid, user.name
    manager.value.uid = user.uid
    manager.value.name = user.name
    admin.snack(
      `${user.name} 님을 ${general.board.id} 게시판의 관리자로 지정 하였습니다.`,
      "success",
    )
  }

  // 글 목록 권한 업데이트
  function updateListPermission(level: number): void {
    access.value.list = level
    updateAllPermissions()
    admin.snack(`글 목록은 ${level} 이상 가능 하도록 수정하였습니다.`, "success")
  }

  // 글 보기 권한 업데이트
  function updateViewPermission(level: number): void {
    access.value.view = level
    updateAllPermissions()
    admin.snack(`글 보기는 ${level} 이상 가능 하도록 수정하였습니다.`, "success")
  }

  // 글 쓰기 권한 업데이트
  function updateWritePermission(level: number): void {
    access.value.write = level
    updateAllPermissions()
    admin.snack(`글 쓰기는 ${level} 이상 가능 하도록 수정하였습니다.`, "success")
  }

  // 댓글 작성 권한 업데이트
  function updateCommentPermission(level: number): void {
    access.value.comment = level
    updateAllPermissions()
    admin.snack(`댓글 쓰기는 ${level} 이상 가능 하도록 수정하였습니다.`, "success")
  }

  // 다운로드 권한 업데이트
  function updateDownloadPermission(level: number): void {
    access.value.download = level
    updateAllPermissions()
    admin.snack(`다운로드는 ${level} 이상 가능 하도록 수정하였습니다.`, "success")
  }

  // 액세스 권한 변경
  async function updateAllPermissions(): Promise<void> {
    // axios.put('some path', access.value) ...
  }

  return {
    manager,
    suggestions,
    access,
    updateBoardManagerSuggestion,
    updateBoardManager,
    updateListPermission,
    updateViewPermission,
    updateWritePermission,
    updateCommentPermission,
    updateDownloadPermission,
  }
})
