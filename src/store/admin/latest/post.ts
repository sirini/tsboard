import { defineStore } from "pinia"
import { ref } from "vue"
import { TSBOARD } from "../../../../tsboard.config"
import { POST } from "../../../messages/store/admin/latest/post"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { useAdminStore } from "../common"
import axios from "axios"
import { AdminLatestPost, AdminLatestPostResult } from "../../../interface/admin_interface"
import { SEARCH, Search } from "../../../interface/board_interface"
import { CODE, ResponseData } from "../../../interface/util_interface"
import { ADMIN } from "../../../messages/store/admin/admin"

export const useAdminLatestPostStore = defineStore("adminLatestPost", () => {
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const confirmRemoveSelectedDialog = ref<boolean>(false)
  const option = ref<Search>(SEARCH.TITLE as Search)
  const keyword = ref<string>("")
  const page = ref<number>(1)
  const pageLength = ref<number>(5)
  const bunch = ref<number>(10)
  const posts = ref<AdminLatestPost[]>([])
  const selectAll = ref<boolean>(false)
  const selected = ref<number[]>([])

  // 최신 글 목록 가져오기
  async function loadLatestPosts(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/admin/latest/post`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        page: page.value,
        bunch: bunch.value,
      },
    })
    const data = response.data as ResponseData<AdminLatestPostResult>
    if (!data || data.success === false) {
      if (data.code === CODE.INVALID_TOKEN && (await auth.updateAccessToken()) === true) {
        return admin.error(ADMIN.NEED_REFRESH)
      }
      return admin.error(POST.FAILED_LOAD)
    }

    pageLength.value = Math.ceil(data.result.maxUid / bunch.value)
    posts.value = data.result.posts
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

    const response = await axios.get(`${TSBOARD.API}/admin/latest/search/post`, {
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
    const data = response.data as ResponseData<AdminLatestPostResult>
    if (!data || data.success === false) {
      return admin.error(POST.NO_RESPONSE)
    }

    pageLength.value = Math.ceil(data.result.maxUid / bunch.value)
    posts.value = data.result.posts
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
    const response = await axios.delete(`${TSBOARD.API}/admin/latest/remove/post`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        targets,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return admin.error(`${POST.FAILED_REMOVE} ${data.error}`)
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
