/**
 * store/admin.ts
 *
 * 관리자 페이지에서 공통으로 사용되는 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminMenuBoardGroup } from "../../interface/admin"

export const MENU = {
  BOARD: {
    GENERAL: 0,
    PERMISSION: 1,
    POINT: 2,
  },
  GROUP: {
    GENERAL: 10,
  },
  GROUPLIST: {
    GENERAL: 20,
  },
  MEMBER: {
    GENERAL: 30,
  },
}

export const useAdminStore = defineStore("admin", () => {
  const menu = ref<number>(MENU.BOARD.GENERAL)
  const topMenu = ref<AdminMenuBoardGroup[]>([
    {
      uid: 1,
      name: "기본 게시판 그룹",
      boards: [
        {
          uid: 1,
          name: "테스트 게시판",
          info: "기본 게시판입니다",
        },
      ],
    },
    {
      uid: 2,
      name: "기본 갤러리 그룹",
      boards: [
        {
          uid: 1,
          name: "테스트 갤러리",
          info: "기본 갤러리입니다",
        },
      ],
    },
  ])
  const snackbar = ref<boolean>(false)
  const snackbarMessage = ref<string>("")
  const snackbarTimeout = ref<number>(3000)
  const snackbarColor = ref<string>("variant-surface")

  // 스낵바 메시지 보이기
  function snack(
    message: string,
    type: "success" | "error" | "info" = "info",
    timeout: number = 3000,
  ): void {
    snackbarMessage.value = message
    snackbarTimeout.value = timeout
    snackbar.value = true

    if (type === "success") snackbarColor.value = "blue"
    else if (type === "error") snackbarColor.value = "red"
    else snackbarColor.value = "blue-grey"
  }

  return {
    menu,
    topMenu,
    snackbar,
    snackbarMessage,
    snackbarTimeout,
    snackbarColor,
    snack,
  }
})
