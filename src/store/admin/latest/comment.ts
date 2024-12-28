import { defineStore } from "pinia"
import { ref } from "vue"
import { TSBOARD } from "../../../../tsboard.config"
import { COMMENT } from "../../../messages/store/admin/latest/comment"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { useAdminStore } from "../common"
import axios from "axios"
import { AdminLatestComment, AdminLatestCommentResult } from "../../../interface/admin_interface"
import { SEARCH, Search } from "../../../interface/board_interface"

export const useAdminLatestCommentStore = defineStore("adminLatestComment", () => {
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const option = ref<Search>(SEARCH.CONTENT as Search)
  const keyword = ref<string>("")
  const page = ref<number>(1)
  const pageLength = ref<number>(5)
  const bunch = ref<number>(10)
  const comments = ref<AdminLatestComment[]>([])
  const selectAll = ref<boolean>(false)
  const selected = ref<number[]>([])

  // 최신 댓글 목록 가져오기
  async function loadLatestComments(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/admin/latest/comment`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
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

    const result = response.data.result as AdminLatestCommentResult
    pageLength.value = Math.ceil(result.maxUid / bunch.value)
    comments.value = result.comments
    comments.value.map((comment: AdminLatestComment) => {
      comment.content = util.stripTags(comment.content)
    })
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

    const response = await axios.get(`${TSBOARD.API}/admin/latest/search/comment`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        option: option.value,
        keyword: encodeURIComponent(keyword.value),
        page: page.value,
        bunch: bunch.value,
      },
    })

    if (!response.data) {
      return admin.error(COMMENT.NO_RESPONSE)
    }

    const result = response.data.result as AdminLatestCommentResult
    pageLength.value = Math.ceil(result.maxUid / bunch.value)
    comments.value = result.comments
    comments.value.map((comment: AdminLatestComment) => {
      comment.content = util.stripTags(comment.content)
    })
  }
  const updateLatestComments = util.debounce(_updateLatestComments, 250)

  // 전체 선택하기 / 해제하기
  function selectAllComments(): void {
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
  async function removeComments(): Promise<void> {
    const targets = selected.value.join(",")
    const response = await axios.delete(`${TSBOARD.API}/admin/latest/remove/comment`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        targets,
      },
    })

    if (!response.data) {
      return admin.error(COMMENT.NO_RESPONSE)
    }

    if (response.data.success === false) {
      return admin.error(`${COMMENT.FAILED_REMOVE} ${response.data.error}`)
    }

    admin.success(COMMENT.REMOVED_COMMENT)
    selected.value = []
    await loadLatestComments()
  }

  return {
    option,
    keyword,
    bunch,
    comments,
    page,
    pageLength,
    selectAll,
    selected,
    loadLatestComments,
    resetKeyword,
    updateLatestComments,
    selectAllComments,
    removeComments,
  }
})
