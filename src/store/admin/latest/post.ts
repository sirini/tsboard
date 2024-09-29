/**
 * store/admin/latest/post
 *
 * 최신 글 조회 및 관리에 필요한 상태 및 함수들
 */

import { edenTreaty } from "@elysiajs/eden"
import { defineStore } from "pinia"
import { ref } from "vue"
import type { App } from "../../../../server/index"
import { TSBOARD } from "../../../../tsboard.config"
import { AdminLatestPost } from "../../../interface/admin"
import { POST } from "../../../messages/store/admin/latest/post"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { useAdminStore } from "../common"

export const useAdminLatestPostStore = defineStore("adminLatestPost", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const confirmRemoveSelectedDialog = ref<boolean>(false)
  const option = ref<"title" | "content">("title")
  const keyword = ref<string>("")
  const page = ref<number>(1)
  const pageLength = ref<number>(5)
  const bunch = ref<number>(10)
  const posts = ref<AdminLatestPost[]>([])
  const selectAll = ref<boolean>(false)
  const selected = ref<number[]>([])

  // 최신 글 목록 가져오기
  async function loadLatestPosts(): Promise<void> {
    const response = await client.tsapi.admin.latest.post.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        page: page.value,
        bunch: bunch.value,
      },
    })

    if (!response.data) {
      return admin.error(POST.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return admin.error(POST.FAILED_LOAD)
    }
    pageLength.value = Math.ceil(response.data.result.maxPostUid / bunch.value)
    posts.value = response.data.result.posts
    admin.success(POST.LOADED_POST)
  }

  // 검색어 지우고 목록 초기화하기
  async function resetKeyword(): Promise<void> {
    keyword.value = ""
    loadLatestPosts()
  }

  // 검색어 입력하면 반응하기
  async function _updateLatestPosts(): Promise<void> {
    if (keyword.value.length < 2) {
      return
    }
    const response = await client.tsapi.admin.latest.search.post.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        option: option.value,
        keyword: keyword.value,
        page: page.value,
        bunch: bunch.value,
      },
    })

    if (!response.data) {
      return admin.error(POST.NO_RESPONSE)
    }
    pageLength.value = Math.ceil(response.data.result.maxPostUid / bunch.value)
    posts.value = response.data.result.posts
  }
  const updateLatestPosts = util.debounce(_updateLatestPosts, 250)

  // 전체 선택하기 / 해제하기
  function selectAllPosts(): void {
    if (selectAll.value === false) {
      selected.value = []
      const checkBoxes = document.querySelectorAll<HTMLInputElement>(
        ".selected input[type='checkbox']",
      )
      checkBoxes.forEach((checkbox) => {
        const uid = parseInt(checkbox.getAttribute("value") || "0")
        selected.value.push(uid)
      })
    } else {
      selected.value = []
    }
  }

  // 선택 삭제하기
  async function removePosts(): Promise<void> {
    const targets = selected.value.join(",")
    const response = await client.tsapi.admin.latest.remove.delete({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        targets,
      },
    })

    if (!response.data) {
      return admin.error(POST.NO_RESPONSE)
    }

    if (response.data.success === false) {
      return admin.error(`${POST.FAILED_REMOVE} ${response.data.error}`)
    }

    admin.success(POST.REMOVED_POST)
    selected.value = []
    await loadLatestPosts()
  }

  return {
    confirmRemoveSelectedDialog,
    option,
    keyword,
    bunch,
    posts,
    page,
    pageLength,
    selectAll,
    selected,
    loadLatestPosts,
    resetKeyword,
    updateLatestPosts,
    selectAllPosts,
    removePosts,
  }
})
