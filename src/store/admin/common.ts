import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminBreadcrumb } from "../../interface/admin_interface"

export const useAdminStore = defineStore("admin", () => {
  const snackbar = ref<boolean>(false)
  const snackbarMessage = ref<string>("")
  const snackbarTimeout = ref<number>(3000)
  const snackbarColor = ref<string>("variant-surface")
  const width = ref<number>(1200)
  const sidebarWidth = ref<number>(250)
  const color = ref<string>("blue-grey")
  const breadcrumbs = ref<AdminBreadcrumb[]>([])

  // 스낵바 메시지 보이기
  function snack(
    message: string,
    color: "blue" | "red" | "blue-grey" = "blue-grey",
    timeout: number = 3000,
  ): void {
    snackbarMessage.value = message
    snackbarTimeout.value = timeout
    snackbarColor.value = color
    snackbar.value = true
  }

  // 스낵바 성공 메시지
  function success(message: string, timeout: number = 3000): void {
    snack(message, "blue", timeout)
  }

  // 스낵바 경고 메시지
  function error(message: string, timeout: number = 3000): void {
    snack(message, "red", timeout)
  }

  // 스낵바 일반 메시지
  function info(message: string, timeout: number = 3000): void {
    snack(message, "blue-grey", timeout)
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
    width,
    sidebarWidth,
    color,
    breadcrumbs,
    success,
    error,
    info,
    clearBreadcrumbs,
    addBreadcrumbs,
  }
})
