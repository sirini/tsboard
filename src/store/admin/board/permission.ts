/**
 * store/admin/board/permission
 *
 * 게시판 관리자 페이지에서 권한 부분에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../../server/index"
import { AdminBoardPermission, AdminPair } from "../../../interface/admin"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { PERMISSION } from "../../../messages/store/admin/board/permission"
import { BOARD_PERMISSION } from "../../../../server/database/admin/group/general/const"
import { TSBOARD } from "../../../../tsboard.config"

export const useAdminBoardPermissionStore = defineStore("adminBoardPermission", () => {
  const route = useRoute()
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const suggestions = ref<AdminPair[]>([])
  const board = ref<AdminBoardPermission>(BOARD_PERMISSION)
  const boardNewAdmin = ref<string>("")

  // 게시판 권한 설정 불러오기
  async function loadPermissionConfig(): Promise<void> {
    const response = await client.tsapi.admin.board.permission.load.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
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
    auth.updateUserToken(response.data.result.newAccessToken)
    board.value = response.data.result.permission
    admin.success(PERMISSION.LOADED_PERMISSION)
  }

  // 회원 이름(닉네임)을 입력할 때마다 하단에 검색해서 보여주기
  async function _updateBoardManagerSuggestion(): Promise<void> {
    const response = await client.tsapi.admin.board.permission.candidates.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        name: boardNewAdmin.value,
        limit: 5,
      },
    })
    if (!response.data) {
      return admin.error(PERMISSION.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return
    }
    if (response.data.result.candidates.length < 1) {
      suggestions.value = [{ uid: 0, name: PERMISSION.EMPTY_CANDIDATES }]
      return
    }
    suggestions.value = response.data.result.candidates
  }
  const updateBoardManagerSuggestion = util.debounce(_updateBoardManagerSuggestion, 250)

  // 선택한 회원을 관리자로 지정하기
  async function updateBoardManager(user: AdminPair): Promise<void> {
    const response = await client.tsapi.admin.board.permission.change.admin.patch({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        userUid: auth.user.uid,
      },
      boardUid: board.value.uid,
      targetUserUid: user.uid,
    })
    if (!response.data) {
      return admin.error(PERMISSION.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return admin.error(`${PERMISSION.UNABLE_CHANGE_ADMIN} (${response.data.error})`)
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    board.value.admin = {
      uid: user.uid,
      name: user.name,
      profile: "",
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
    const response = await client.tsapi.admin.board.permission.update.levels.patch({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        userUid: auth.user.uid,
      },
      boardUid: board.value.uid,
      levels: board.value.level,
    })
    if (!response.data) {
      admin.error(PERMISSION.NO_RESPONSE)
      return false
    }
    if (response.data.success === false) {
      admin.error(`${PERMISSION.UNABLE_UPDATE_LEVEL} (${response.data.error})`)
      return false
    }
    auth.updateUserToken(response.data.result.newAccessToken)
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
