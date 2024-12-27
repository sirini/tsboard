import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { PERMISSION } from "../../../messages/store/admin/board/permission"
import { TSBOARD } from "../../../../tsboard.config"
import axios from "axios"
import { ADMIN_BOARD_LEVEL_POLICY, AdminBoardLevelPolicy } from "../../../interface/admin_interface"
import { BoardWriter, Pair } from "../../../interface/board_interface"

export const useAdminBoardPermissionStore = defineStore("adminBoardPermission", () => {
  const route = useRoute()
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const suggestions = ref<BoardWriter[]>([])
  const board = ref<AdminBoardLevelPolicy>(ADMIN_BOARD_LEVEL_POLICY)
  const boardNewAdmin = ref<string>("")

  // 게시판 권한 설정 불러오기
  async function loadPermissionConfig(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/admin/board/permission/load`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        id: route.params.id as string,
        userUid: auth.user.uid,
      },
    })

    if (!response.data) {
      return admin.error(PERMISSION.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return admin.error(`${PERMISSION.UNABLE_LOAD_PERMISSION} (${response.data.error})`)
    }

    board.value = response.data.result as AdminBoardLevelPolicy
    admin.success(PERMISSION.LOADED_PERMISSION)
  }

  // 회원 이름(닉네임)을 입력할 때마다 하단에 검색해서 보여주기
  async function _updateBoardManagerSuggestion(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/admin/board/permission/candidates`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        name: encodeURIComponent(boardNewAdmin.value),
        limit: 5,
      },
    })

    if (!response.data) {
      return admin.error(PERMISSION.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return
    }
    if (response.data.result.length < 1) {
      suggestions.value = [
        { uid: 0, name: PERMISSION.EMPTY_CANDIDATES, profile: "", signature: "" },
      ]
      return
    }
    suggestions.value = response.data.result as BoardWriter[]
  }
  const updateBoardManagerSuggestion = util.debounce(_updateBoardManagerSuggestion, 250)

  // 선택한 회원을 관리자로 지정하기
  async function updateBoardManager(user: Pair): Promise<void> {
    const fd = new FormData()
    fd.append("boardUid", board.value.uid.toString())
    fd.append("targetUserUid", user.uid.toString())

    const response = await axios.patch(`${TSBOARD.API}/admin/board/permission/change/admin`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })

    if (!response.data) {
      return admin.error(PERMISSION.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return admin.error(`${PERMISSION.UNABLE_CHANGE_ADMIN} (${response.data.error})`)
    }

    board.value.admin = {
      uid: user.uid,
      name: user.name,
      profile: "",
      signature: "",
    }
    admin.success(`${user.name} ${PERMISSION.UPDATED_BOARD_ADMIN}`)
  }

  // 글 목록 권한 업데이트
  async function updateListPermission(level: number): Promise<void> {
    board.value.level.list = level
    if ((await updateAllPermissions()) === true) {
      admin.success(`${level} ${PERMISSION.UPDATED_LIST_LEVEL}`)
    }
  }

  // 글 보기 권한 업데이트
  async function updateViewPermission(level: number): Promise<void> {
    board.value.level.view = level
    if ((await updateAllPermissions()) === true) {
      admin.success(`${level} ${PERMISSION.UPDATED_VIEW_LEVEL}`)
    }
  }

  // 글 쓰기 권한 업데이트
  async function updateWritePermission(level: number): Promise<void> {
    board.value.level.write = level
    if ((await updateAllPermissions()) === true) {
      admin.success(`${level} ${PERMISSION.UPDATED_WRITE_LEVEL}`)
    }
  }

  // 댓글 작성 권한 업데이트
  async function updateCommentPermission(level: number): Promise<void> {
    board.value.level.comment = level
    if ((await updateAllPermissions()) === true) {
      admin.success(`${level} ${PERMISSION.UPDATED_COMMENT_LEVEL}`)
    }
  }

  // 다운로드 권한 업데이트
  async function updateDownloadPermission(level: number): Promise<void> {
    board.value.level.download = level
    if ((await updateAllPermissions()) === true) {
      admin.success(`${level} ${PERMISSION.UPDATED_DOWNLOAD_LEVEL}`)
    }
  }

  // 액세스 권한 변경
  async function updateAllPermissions(): Promise<boolean> {
    const fd = new FormData()
    fd.append("boardUid", board.value.uid.toString())
    fd.append("list", board.value.level.list.toString())
    fd.append("view", board.value.level.view.toString())
    fd.append("write", board.value.level.write.toString())
    fd.append("comment", board.value.level.comment.toString())
    fd.append("download", board.value.level.download.toString())

    const response = await axios.patch(`${TSBOARD.API}/admin/board/permission/update/levels`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })

    if (!response.data) {
      admin.error(PERMISSION.NO_RESPONSE)
      return false
    }
    if (response.data.success === false) {
      admin.error(`${PERMISSION.UNABLE_UPDATE_LEVEL} (${response.data.error})`)
      return false
    }

    return true
  }

  return {
    suggestions,
    board,
    boardNewAdmin,
    loadPermissionConfig,
    updateBoardManagerSuggestion,
    updateBoardManager,
    updateListPermission,
    updateViewPermission,
    updateWritePermission,
    updateCommentPermission,
    updateDownloadPermission,
  }
})
