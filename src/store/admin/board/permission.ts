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
import { AdminBoardPermission, AdminDefaultParams, AdminPairItem } from "../../../interface/admin"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../auth"
import { useUtilStore } from "../../util"
import { PERMISSION } from "../../../messages/store/admin/board/permission"

export const useAdminBoardPermissionStore = defineStore("adminBoardPermission", () => {
  const route = useRoute()
  const server = edenTreaty<App>(process.env.API!)
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const dbresult = ref<AdminPairItem[]>([
    { uid: 1, name: "sample_user@test.com" },
    { uid: 2, name: "example_user@naver.com" },
    { uid: 3, name: "test_user_id@gmail.com" },
    { uid: 4, name: "abc@studio.net" },
    { uid: 5, name: "zflip5@samsung.com" },
  ])
  const suggestions = ref<AdminPairItem[]>(dbresult.value)
  const board = ref<AdminBoardPermission>({
    uid: 0,
    id: "",
    admin: {
      uid: 0,
      name: "",
      profile: "/no-profile.png",
    },
    level: {
      list: 0,
      view: 0,
      write: 0,
      comment: 0,
      download: 0,
    },
  })
  const boardNewAdmin = ref<string>("")
  const defaultParams = ref<AdminDefaultParams>({
    $headers: {
      authorization: auth.user.token,
    },
    boardUid: board.value.uid,
  })

  // 게시판 권한 설정 불러오기
  async function loadPermissionConfig(): Promise<void> {
    const response = await server.api.admin.board.permission.load.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: route.params.id as string,
      },
    })
    if (response.data === null) {
      admin.error(PERMISSION.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      admin.error(`${PERMISSION.UNABLE_LOAD_PERMISSION} (${response.data.error})`)
      return
    }
    if (response.data.result.permission.uid < 1) {
      admin.error(PERMISSION.UNKNOWN_INFO)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken!)
    board.value = response.data.result.permission as AdminBoardPermission
    admin.success(PERMISSION.LOADED_PERMISSION)
  }

  // 회원 이름(닉네임)을 입력할 때마다 하단에 검색해서 보여주기
  async function _updateBoardManagerSuggestion(): Promise<void> {
    // TODO 회원명 검색 시 적합한 리스트를 가져와서 보여주기
  }
  const updateBoardManagerSuggestion = util.debounce(_updateBoardManagerSuggestion, 250)

  // 선택한 회원을 관리자로 지정하기
  async function updateBoardManager(user?: AdminPairItem): Promise<void> {
    if (user === undefined) {
      board.value.admin.uid = 0
      board.value.admin.name = ""
      admin.success(`게시판 관리자를 따로 지정하지 않습니다.`)
      return
    }

    // do something with user.uid, user.name
    board.value.admin.uid = user.uid
    board.value.admin.name = user.name
    admin.success(`${user.name} 님을 ${board.value.id} 게시판의 관리자로 지정 하였습니다.`)
  }

  // 글 목록 권한 업데이트
  function updateListPermission(level: number): void {
    board.value.level.list = level
    updateAllPermissions()
    admin.success(`글 목록은 ${level} 이상 가능 하도록 수정하였습니다.`)
  }

  // 글 보기 권한 업데이트
  function updateViewPermission(level: number): void {
    board.value.level.view = level
    updateAllPermissions()
    admin.success(`글 보기는 ${level} 이상 가능 하도록 수정하였습니다.`)
  }

  // 글 쓰기 권한 업데이트
  function updateWritePermission(level: number): void {
    board.value.level.write = level
    updateAllPermissions()
    admin.success(`글 쓰기는 ${level} 이상 가능 하도록 수정하였습니다.`)
  }

  // 댓글 작성 권한 업데이트
  function updateCommentPermission(level: number): void {
    board.value.level.comment = level
    updateAllPermissions()
    admin.success(`댓글 쓰기는 ${level} 이상 가능 하도록 수정하였습니다.`)
  }

  // 다운로드 권한 업데이트
  function updateDownloadPermission(level: number): void {
    board.value.level.download = level
    updateAllPermissions()
    admin.success(`다운로드는 ${level} 이상 가능 하도록 수정하였습니다.`)
  }

  // 액세스 권한 변경
  async function updateAllPermissions(): Promise<void> {
    // axios.put('some path', access.value) ...
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
