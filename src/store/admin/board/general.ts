/**
 * store/admin/board/general
 *
 * 게시판 관리자 페이지에서 일반 부분에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminBoardConfig, AdminPairItem } from "../../../interface/admin"
import { useAdminStore } from "../common"

export const useAdminBoardGeneralStore = defineStore("adminBoardGeneral", () => {
  const admin = useAdminStore()
  const confirmRemoveCategoryDialog = ref<boolean>(false)
  const board = ref<AdminBoardConfig>({
    uid: 1,
    id: "test",
    type: "board",
    group: "default",
    name: "테스트 게시판",
    info: "이 게시판의 간단 설명입니다.",
    rows: 20,
    category: {
      add: "",
      remove: { uid: 0, name: "" },
      list: [
        { uid: 1, name: "기본" },
        { uid: 2, name: "sample" },
        { uid: 3, name: "example" },
        { uid: 4, name: "test" },
        { uid: 5, name: "news" },
      ],
    },
  })
  const groups = ref<AdminPairItem[]>([
    { uid: 1, name: "sample_group" },
    { uid: 2, name: "test_group" },
    { uid: 3, name: "example_group" },
  ])

  // 그룹 변경하기
  async function changeGroup(group: AdminPairItem): Promise<void> {
    // do something with board.value.uid
    board.value.group = group.name
    admin.snack(
      `${board.value.id} 게시판의 소속 그룹을 ${group.name} 으로 변경 하였습니다.`,
      "success",
    )
  }

  // 카테고리 추가하기
  async function addCategory(): Promise<void> {
    const name = board.value.category.add.trim()
    if (name.length < 2) {
      admin.snack("카테고리 이름이 너무 짧습니다. 2글자 이상 입력해 주세요.")
      return
    }
    // do something with board.value.uid
    board.value.category.list.push({ uid: 10, name })
    admin.snack(`${name} 카테고리를 추가했습니다.`, "success")
  }

  // 카테고리 삭제 전 확인하기
  function confirmRemoveCategory(uid: number, name: string): void {
    if (uid < 2) {
      admin.snack("기본 카테고리는 삭제할 수 없습니다.", "error")
      return
    }
    board.value.category.remove.uid = uid
    board.value.category.remove.name = name
    confirmRemoveCategoryDialog.value = true
  }

  // 카테고리 삭제하기
  async function removeCategory(): Promise<void> {
    if (board.value.category.remove.uid < 2) {
      admin.snack("기본 카테고리는 삭제할 수 없습니다.", "error")
      return
    }
    // do something with board.value.uid
    board.value.category.list = board.value.category.list.filter((cat: any) => {
      return cat.uid !== board.value.category.remove.uid
    })
    admin.snack(
      "선택하신 카테고리를 성공적으로 삭제하고, 대상 글들의 카테고리를 기본으로 변경 하였습니다.",
      "success",
    )
  }

  // 게시판 이름 변경하기
  async function changeName(): Promise<void> {
    const name = board.value.name.trim()
    if (name.length < 2) {
      admin.snack("게시판 이름이 너무 짧습니다. 2글자 이상 입력해 주세요.", "error")
      return
    }
    // do something with board.value.uid
    admin.snack(`게시판 이름을 ${name} (으)로 변경 하였습니다.`, "success")
  }

  // 게시판 설명 변경하기
  async function changeInfo(): Promise<void> {
    const info = board.value.info.trim()
    if (info.length < 2) {
      admin.snack("게시판 설명이 너무 짧습니다. 2글자 이상 입력해 주세요.", "error")
      return
    }
    // do something with board.value.uid
    admin.snack("게시판 설명을 성공적으로 변경 하였습니다.", "success")
  }

  // 게시판 타입 변경하기
  async function changeType(): Promise<void> {
    // do something with board.value.type
    admin.snack(`게시판 타입을 ${board.value.type}으(로) 변경 하였습니다.`, "success")
  }

  // 한 페이지에 표시할 게시글 개수 변경하기
  async function changeRows(): Promise<void> {
    const rows = board.value.rows
    if (rows < 1 || rows > 100) {
      admin.snack("게시글은 한 페이지에 1개 이상 100개 이하로만 출력 가능합니다.", "error")
      board.value.rows = 20
      return
    }
    // do something with board.value.uid
    admin.snack(`한 페이지에 ${rows} 개씩 게시글이 나오도록 변경 하였습니다.`, "success")
  }

  return {
    board,
    confirmRemoveCategoryDialog,
    groups,
    changeGroup,
    changeName,
    changeInfo,
    changeType,
    changeRows,
    addCategory,
    confirmRemoveCategory,
    removeCategory,
  }
})
