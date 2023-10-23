/**
 * store/admin.ts
 *
 * 관리자 페이지에서 사용되는 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { BoardGroup } from "../interface/admin"

export const useAdminStore = defineStore("admin", () => {
  const group = ref<BoardGroup[]>([
    {
      uid: 1,
      name: "기본 게시판 그룹",
      manager: 1,
      boards: [
        {
          uid: 1,
          name: "테스트 게시판",
          info: "기본 게시판입니다",
          manager: 1,
        },
      ],
    },
    {
      uid: 2,
      name: "기본 갤러리 그룹",
      manager: 1,
      boards: [
        {
          uid: 1,
          name: "테스트 갤러리",
          info: "기본 갤러리입니다",
          manager: 1,
        },
      ],
    },
  ])
  const board = ref<any>({
    menu: 0,
    id: "test",
    group: {
      selected: "default",
      list: ["another_group", "sample_group", "tsboard_group"],
    },
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
  const confirmRemoveCategoryDialog = ref<boolean>(false)
  const snackbar = ref<boolean>(false)
  const snackbarMessage = ref<string>("")
  const snackbarTimeout = ref<number>(3000)

  // 스낵바 메시지 보이기
  function snack(message: string, timeout: number = 3000): void {
    snackbarMessage.value = message
    snackbarTimeout.value = timeout
    snackbar.value = true
  }

  // 카테고리 추가하기
  function addCategory(): void {
    const name = board.value.category.add.trim()
    if (name.length < 2) {
      snack("카테고리 이름이 너무 짧습니다. 2글자 이상 입력해 주세요.")
      return
    }
    // do something
    board.value.category.list.push({ uid: 10, name })
  }

  // 카테고리 삭제 전 확인하기
  function confirmRemoveCategory(uid: number, name: string): void {
    if (uid === 1) {
      snack("기본 카테고리는 삭제할 수 없습니다.")
      return
    }
    board.value.category.remove.uid = uid
    board.value.category.remove.name = name
    confirmRemoveCategoryDialog.value = true
  }

  // 카테고리 삭제하기
  function removeCategory(uid: number): void {
    // do something
    board.value.category.list = board.value.category.list.filter((cat: any) => {
      return cat.uid !== uid
    })
  }

  return {
    group,
    board,
    confirmRemoveCategoryDialog,
    snackbar,
    snackbarMessage,
    snackbarTimeout,
    snack,
    addCategory,
    confirmRemoveCategory,
    removeCategory,
  }
})
