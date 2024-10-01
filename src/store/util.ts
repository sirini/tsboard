/**
 * store/util
 *
 * 여러 곳에서 자주 사용되는 함수들 모음
 */

import { defineStore } from "pinia"
import { ref } from "vue"
import { NavigationFailure, useRouter } from "vue-router"
import { ACTION_TARGET, BOARD_TYPE } from "../../server/database/board/const"
import { BoardType } from "../interface/board"

export const useUtilStore = defineStore("util", () => {
  const router = useRouter()
  const snackbar = ref<boolean>(false)
  const snackbarTimeout = ref<number>(3000)
  const snackbarText = ref<string>("")
  const alertbar = ref<boolean>(false)
  const alertType = ref<"success" | "error" | "info">("error")
  const alertText = ref<string>("")
  const alertTimeout = ref<number>(3000)
  const filters = {
    basic: /[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gim,
    nospace: /[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/ ]/gim,
    email: /^([0-9a-z_\.-]+)@([0-9a-z_-]+)(\.[a-z]+){1,2}$/,
    password: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/,
    url: /(http(s)?:\/\/)(www\.)?[-a-zA-Z0-9@:%._\+\/~#=]{2,256}\.(jpg|jpeg|png|gif)?\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/,
    youtube: /(https:\/\/)(www\.)?(youtu(be)?)\.(be|com)?\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/,
  }

  // 스낵 메시지 보여주기
  function snack(message: string, timeout: number = 3000): void {
    snackbarText.value = message
    snackbarTimeout.value = timeout
    snackbar.value = true
  }

  // 상단 알림 메시지 보여주기
  function alert(
    message: string,
    type: "success" | "error" | "info" = "error",
    timeout: number = 5000,
  ): void {
    alertText.value = message
    alertType.value = type
    alertbar.value = true
    alertTimeout.value = timeout
  }

  // 성공 메시지 축약형
  function success(message: string, timeout: number = 5000): void {
    alert(message, "success", timeout)
  }

  // 에러 메시지 축약형
  function error(message: string, timeout: number = 5000): void {
    alert(message, "error", timeout)
  }

  // 정보 메시지 축약형
  function info(message: string, timeout: number = 5000): void {
    alert(message, "info", timeout)
  }

  // 액션에 따른 라우터 이름 변환
  function nameByAction(action: number): string {
    switch (action) {
      case ACTION_TARGET.LIST:
        return "List"
      case ACTION_TARGET.PAGING:
        return "Paging"
      case ACTION_TARGET.WRITE:
        return "Write"
      case ACTION_TARGET.MODIFY:
        return "Modify"
      default:
        return "View"
    }
  }

  // 게시판 형태에 따른 라우터 이름 반환
  function routerName(type: BoardType, action: number): string {
    const actionName = nameByAction(action)
    switch (type) {
      case BOARD_TYPE.GALLERY:
        return `gallery${actionName}`
      case BOARD_TYPE.BLOG:
        return `blog${actionName}`
      case BOARD_TYPE.SHOP:
        return `shop${actionName}`
      default:
        return `board${actionName}`
    }
  }

  // 페이지 이동하기
  async function go(
    target: string | BoardType,
    id: string = "",
    no: number = 0,
  ): Promise<NavigationFailure | void | undefined> {
    let name = ""
    if ("string" === typeof target) {
      name = target
    } else {
      name = routerName(target, no > 0 ? ACTION_TARGET.VIEW : ACTION_TARGET.LIST)
    }

    if (id.length < 1) {
      return router.push({ name })
    }
    if (no < 1) {
      return router.push({ name, params: { id } })
    }
    return router.push({ name, params: { id, no } })
  }

  // 외부 페이지를 새창으로 열기
  function open(url: string): void {
    window.open(url, "_blank")
  }

  // 주어진 URL로 이동
  function move(url: string): void {
    window.location.href = url
  }

  // 페이지 뒤로가기
  function back(): void {
    router.back()
  }

  // 디바운스 함수
  function debounce<T extends (...args: any[]) => any>(func: T, delay: number = 300) {
    let timeout: any = null
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      const context = this as ThisParameterType<T>
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, delay)
    }
  }

  // 밀리세컨드 숫자를 날짜 형식으로 보여주기
  function date(milliseconds: number, showYmd: boolean = true, showHms: boolean = false): string {
    const time = new Date(milliseconds)
    let result = ""
    if (showYmd) {
      const year = time.getFullYear().toString().slice(2)
      const month = String(time.getMonth() + 1).padStart(2, "0")
      const day = String(time.getDate()).padStart(2, "0")
      result = `${year}/${month}/${day}`
    }
    if (showHms) {
      const hour = String(time.getHours()).padStart(2, "0")
      const minute = String(time.getMinutes()).padStart(2, "0")
      const second = String(time.getSeconds()).padStart(2, "0")
      result += ` ${hour}:${minute}:${second}`
    }
    return result
  }

  // HTML unescape HTML 처리 (<--> Bun.escapeHTML)
  function unescape(text: string): string {
    let result = text.replaceAll("&quot;", '"')
    result = result.replaceAll("&amp;", "&")
    result = result.replaceAll("&#x27;", "'")
    result = result.replaceAll("&lt;", "<")
    result = result.replaceAll("&gt;", ">")
    return result
  }

  // 큰 숫자는 K, M 단위를 뒤에 붙여서 표현
  function num(big: number): string {
    if (big > 999999) {
      return (big / 1000000).toFixed(1) + "M"
    } else if (big > 999) {
      return (big / 1000).toFixed(1) + "K"
    } else {
      return big.toString()
    }
  }

  return {
    snackbar,
    snackbarTimeout,
    snackbarText,
    alertbar,
    alertType,
    alertText,
    alertTimeout,
    filters,
    snack,
    success,
    error,
    info,
    routerName,
    go,
    open,
    move,
    back,
    debounce,
    date,
    unescape,
    num,
  }
})
