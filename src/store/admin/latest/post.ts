/**
 * store/admin/latest/post
 *
 * 최신 글 조회 및 관리에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../../server/index"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../auth"
import { useUtilStore } from "../../util"
import { AdminLatestPost } from "../../../interface/admin"
import { POST } from "../../../messages/store/admin/latest/post"

export const useAdminLatestPostStore = defineStore("adminLatestPost", () => {
  const server = edenTreaty<App>(process.env.API!)
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const option = ref<"title" | "content">("title")
  const keyword = ref<string>("")
  const page = ref<number>(1)
  const pageLength = ref<number>(5)
  const bunch = ref<number>(10)
  const posts = ref<AdminLatestPost[]>([])

  // 최신 글 목록 가져오기
  async function loadLatestPosts(): Promise<void> {
    const response = await server.api.admin.latest.post.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        page: page.value,
        bunch: bunch.value,
      },
    })
    if (!response.data) {
      admin.error(POST.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      admin.error(POST.FAILED_LOAD)
      return
    }
    if (!response.data.result) {
      admin.error(POST.FAILED_LOAD)
      return
    }
    pageLength.value = Math.ceil((response.data.result.totalPostCount as number) / bunch.value)
    posts.value = response.data.result.posts as AdminLatestPost[]
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
    const response = await server.api.admin.latest.search.post.get({
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
      admin.error(POST.NO_RESPONSE)
      return
    }
    if (!response.data.result) {
      return
    }
    pageLength.value = Math.ceil((response.data.result.totalPostCount as number) / bunch.value)
    posts.value = response.data.result.posts as AdminLatestPost[]
  }
  const updateLatestPosts = util.debounce(_updateLatestPosts, 250)

  return {
    option,
    keyword,
    bunch,
    posts,
    page,
    pageLength,
    loadLatestPosts,
    resetKeyword,
    updateLatestPosts,
  }
})
