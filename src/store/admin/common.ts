/**
 * store/admin.ts
 *
 * 관리자 페이지에서 공통으로 사용되는 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminBreadcrumb } from "../../interface/admin"

export const useAdminStore = defineStore("admin", () => {
  const snackbar = ref<boolean>(false)
  const snackbarMessage = ref<string>("")
  const snackbarTimeout = ref<number>(3000)
  const snackbarColor = ref<string>("variant-surface")
  const breadcrumbs = ref<AdminBreadcrumb[]>([])
  const PREFIX = process.env.PREFIX || ""

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

  // 관리 페이지 최상단 메뉴 초기화
  function clearBreadcrumbs(): void {
    breadcrumbs.value = []
  }

  // 관리 페이지 최상단 메뉴에 메뉴 추가
  function addBreadcrumbs(title: string, href: string, disabled: boolean = false): void {
    breadcrumbs.value.push({
      title,
      href,
      disabled,
    })
  }

  return {
    snackbar,
    snackbarMessage,
    snackbarTimeout,
    snackbarColor,
    breadcrumbs,
    snack,
    clearBreadcrumbs,
    addBreadcrumbs,
  }
})
