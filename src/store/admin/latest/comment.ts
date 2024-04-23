/**
 * store/admin/latest/comment
 *
 * 최신 댓글 조회 및 관리에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../../server/index"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { AdminLatestComment } from "../../../interface/admin"
import { COMMENT } from "../../../messages/store/admin/latest/comment"
import { TSBOARD } from "../../../../tsboard.config"

export const useAdminLatestCommentStore = defineStore("adminLatestComment", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const option = ref<"content">("content")
  const keyword = ref<string>("")
  const page = ref<number>(1)
  const pageLength = ref<number>(5)
  const bunch = ref<number>(10)
  const comments = ref<AdminLatestComment[]>([])

  // 최신 댓글 목록 가져오기
  async function loadLatestComments(): Promise<void> {
    const response = await client.tsapi.admin.latest.comment.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        page: page.value,
        bunch: bunch.value,
      },
    })

    if (!response.data) {
      return admin.error(COMMENT.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return admin.error(COMMENT.FAILED_LOAD)
    }
    pageLength.value = Math.ceil(response.data.result.maxCommentUid / bunch.value)
    comments.value = response.data.result.comments
    admin.success(COMMENT.LOADED_COMMENT)
  }

  // 검색어 지우고 목록 초기화하기
  async function resetKeyword(): Promise<void> {
    keyword.value = ""
    loadLatestComments()
  }

  // 검색어 입력하면 반응하기
  async function _updateLatestComments(): Promise<void> {
    if (keyword.value.length < 2) {
      return
    }
    const response = await client.tsapi.admin.latest.search.comment.get({
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
      return admin.error(COMMENT.NO_RESPONSE)
    }
    pageLength.value = Math.ceil(response.data.result.maxCommentUid / bunch.value)
    comments.value = response.data.result.comments
  }
  const updateLatestComments = util.debounce(_updateLatestComments, 250)

  return {
    option,
    keyword,
    bunch,
    comments,
    page,
    pageLength,
    loadLatestComments,
    resetKeyword,
    updateLatestComments,
  }
})
