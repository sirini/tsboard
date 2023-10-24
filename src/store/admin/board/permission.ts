/**
 * store/admin/board/permission.ts
 *
 * 게시판 관리자 페이지에서 권한 부분에 필요한 상태 및 유틸리티 함수들
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
  async function updateBoardManagerSuggestion(): Promise<void> {
    // do something with manager.value.name
    suggestions.value = dbresult.value.filter((user: AdminPairItem) => {
      return user.name.indexOf(manager.value.name) > -1
    })
  }

  // 선택한 회원을 관리자로 지정하기
  async function updateBoardManager(user: AdminPairItem): Promise<void> {
    // do something with user.uid, user.name
    manager.value.uid = user.uid
    manager.value.name = user.name
    admin.snack(
      `${user.name} 님을 ${general.board.id} 게시판의 관리자로 지정 하였습니다.`,
      "success",
    )
  }

  // 목록보기 액세스 권한 변경
  async function updateAccessList(level: number): Promise<void> {
    // do something
    access.value.list = level
    admin.snack(
      `${general.board.id} 게시판의 목록 보기 레벨을 ${level} 이상으로 설정 하였습니다.`,
      "success",
    )
  }

  // 글보기 액세스 권한 변경
  async function updateAccessView(level: number): Promise<void> {
    // do something
    access.value.view = level
    admin.snack(
      `${general.board.id} 게시판의 글보기 레벨을 ${level} 이상으로 설정 하였습니다.`,
      "success",
    )
  }

  // 글쓰기 액세스 권한 변경
  async function updateAccessWrite(level: number): Promise<void> {
    // do something
    access.value.write = level
    admin.snack(
      `${general.board.id} 게시판의 글작성 레벨을 ${level} 이상으로 설정 하였습니다.`,
      "success",
    )
  }

  // 댓글쓰기 액세스 권한 변경
  async function updateAccessComment(level: number): Promise<void> {
    // do something
    access.value.comment = level
    admin.snack(
      `${general.board.id} 게시판의 댓글쓰기 레벨을 ${level} 이상으로 설정 하였습니다.`,
      "success",
    )
  }

  // 다운로드 액세스 권한 변경
  async function updateAccessDownload(level: number): Promise<void> {
    // do something
    access.value.download = level
    admin.snack(
      `${general.board.id} 게시판의 다운로드 레벨을 ${level} 이상으로 설정 하였습니다.`,
      "success",
    )
  }

  return {
    manager,
    suggestions,
    access,
    updateBoardManagerSuggestion,
    updateBoardManager,
    updateAccessList,
    updateAccessView,
    updateAccessWrite,
    updateAccessComment,
    updateAccessDownload,
  }
})
