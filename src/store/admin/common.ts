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
  const breadcrumbLevel1 = ref<AdminBreadcrumb | undefined>(undefined)
  const breadcrumbLevel2 = ref<AdminBreadcrumb | undefined>(undefined)
  const breadcrumbLevel3 = ref<AdminBreadcrumb | undefined>(undefined)
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

  // 관리 페이지 최상단 메뉴바 구현
  function setBreadcrumbs(
    level1: AdminBreadcrumb | undefined = undefined,
    level2: AdminBreadcrumb | undefined = undefined,
    level3: AdminBreadcrumb | undefined = undefined,
  ): void {
    breadcrumbLevel1.value = level1
    breadcrumbLevel2.value = level2
    breadcrumbLevel3.value = level3
  }

  return {
    snackbar,
    snackbarMessage,
    snackbarTimeout,
    snackbarColor,
    breadcrumbLevel1,
    breadcrumbLevel2,
    breadcrumbLevel3,
    snack,
    setBreadcrumbs,
  }
})
