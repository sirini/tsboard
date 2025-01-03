import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { GENERAL } from "../../../messages/store/admin/group/general"
import { TSBOARD } from "../../../../tsboard.config"
import axios from "axios"
import {
  ADMIN_GROUP_BOARD_STATUS,
  ADMIN_GROUP_CONFIG,
  AdminCreateBoardResult,
  AdminGroupBoardItem,
  AdminGroupConfig,
  AdminGroupListResult,
} from "../../../interface/admin_interface"
import { BoardWriter, Pair, Triple } from "../../../interface/board_interface"
import { CODE, ResponseData } from "../../../interface/util_interface"
import { ADMIN } from "../../../messages/store/admin/admin"

export const useAdminGroupGeneralStore = defineStore("adminGroupGeneral", () => {
  const route = useRoute()
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const group = ref<AdminGroupConfig>(ADMIN_GROUP_CONFIG)
  const removeBoardTarget = ref<Pair>({ uid: 0, name: "" })
  const confirmRemoveBoardDialog = ref<boolean>(false)
  const boards = ref<AdminGroupBoardItem[]>([])
  const existBoardIds = ref<Triple[]>([])
  const suggestions = ref<BoardWriter[]>([])
  const newGroupManager = ref<string>("")
  const newBoardId = ref<string>("")

  // 지정된 그룹의 설정값 불러오기
  async function loadGeneralConfig(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/admin/group/general/load`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        id: route.params.id as string,
      },
    })
    const data = response.data as ResponseData<AdminGroupListResult>
    if (!data || data.success === false) {
      if (data.code === CODE.INVALID_TOKEN && (await auth.updateAccessToken()) === true) {
        return admin.error(ADMIN.NEED_REFRESH)
      }
      return admin.error(`${GENERAL.UNABLE_LOAD_GROUP_INFO} (${data.error})`)
    }

    group.value = data.result.config
    group.value.id = route.params.id as string

    boards.value = data.result.boards
    admin.success(GENERAL.LOADED_CONFIG)
  }

  // 회원 아이디를 입력할 때마다 하단에 검색해서 보여주기
  async function _updateGroupManagerSuggestion(): Promise<void> {
    if (newGroupManager.value.length < 2) {
      return
    }

    const response = await axios.get(`${TSBOARD.API}/admin/group/general/candidates`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        name: encodeURIComponent(newGroupManager.value),
        limit: 5,
      },
    })
    const data = response.data as ResponseData<BoardWriter[]>
    if (!data || data.success === false) {
      return
    }
    if (data.result.length < 1) {
      suggestions.value = [{ uid: 0, name: GENERAL.EMPTY_CANDIDATES, profile: "", signature: "" }]
      return
    }
    suggestions.value = data.result
  }
  const updateGroupManagerSuggestion = util.debounce(_updateGroupManagerSuggestion, 250)

  // 새 게시판 생성을 위해 아이디를 입력할 때 기존 게시판 아이디를 보여주기
  async function _updateExistBoardIds(): Promise<void> {
    if (newBoardId.value.length < 2) {
      return
    }

    const response = await axios.get(`${TSBOARD.API}/admin/group/general/boardids`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        id: newBoardId.value,
        limit: 5,
      },
    })
    const data = response.data as ResponseData<Triple[]>
    if (!data || data.success === false) {
      return
    }
    if (data.result.length < 1) {
      existBoardIds.value = [{ uid: 0, id: "", name: GENERAL.NO_DUPLICATE_ID }]
      return
    }
    existBoardIds.value = data.result
  }
  const updateExistBoardIds = util.debounce(_updateExistBoardIds, 250)

  // 새 게시판 생성하기
  async function createNewBoard(): Promise<void> {
    const newId = newBoardId.value.trim()
    if (newId.length < 2) {
      return admin.error(GENERAL.TOO_SHORT_BOARD_ID)
    }
    if (/^[a-z0-9_]{2,}$/.test(newId) === false) {
      admin.error(GENERAL.INVALID_BOARD_ID)
      newBoardId.value = ""
      return
    }

    const fd = new FormData()
    fd.append("groupUid", group.value.uid.toString())
    fd.append("newId", newId)

    const response = await axios.post(`${TSBOARD.API}/admin/group/general/create/board`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const data = response.data as ResponseData<AdminCreateBoardResult>
    if (!data || data.success === false) {
      return admin.error(`${GENERAL.FAILED_CREATE_BOARD} (${data.error})`)
    }

    boards.value.push({
      uid: data.result.uid,
      id: newId,
      type: data.result.type,
      name: data.result.name,
      info: data.result.info,
      manager: {
        uid: data.result.manager.uid,
        name: data.result.manager.name,
        profile: "",
        signature: "",
      },
      count: 0,
      total: ADMIN_GROUP_BOARD_STATUS,
    })
    admin.success(`[${newId}] ${GENERAL.ADDED_NEW_BOARD}`)
    newBoardId.value = ""
  }

  // 선택한 회원을 그룹 관리자로 지정하기
  async function updateGroupManager(user: Pair): Promise<void> {
    const fd = new FormData()
    fd.append("groupUid", group.value.uid.toString())
    fd.append("targetUserUid", user.uid.toString())

    const response = await axios.patch(`${TSBOARD.API}/admin/group/general/change/admin`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return admin.error(`${GENERAL.UNABLE_CHANGE_ADMIN} (${data.error})`)
    }

    group.value.manager.uid = user.uid
    group.value.manager.name = user.name
    admin.success(`[${user.name}] ${GENERAL.CHANGED_GROUP_ADMIN}`)
  }

  // 게시판을 정말로 삭제할건지 확인하는 창 띄우기
  function confirmRemoveBoard(uid: number, id: string): void {
    removeBoardTarget.value.uid = uid
    removeBoardTarget.value.name = id
    confirmRemoveBoardDialog.value = true
  }

  // 게시판을 삭삭제하지 않고 그대로 닫기
  function closeRemoveBoardDialog(): void {
    removeBoardTarget.value.uid = 0
    removeBoardTarget.value.name = ""
    confirmRemoveBoardDialog.value = false
  }

  // 게시판을 정말로 삭제할 때 처리
  async function removeBoard(): Promise<void> {
    if (removeBoardTarget.value.uid < 1) {
      return admin.error(GENERAL.INVALID_REMOVE_TARGET)
    }

    const response = await axios.delete(`${TSBOARD.API}/admin/group/general/remove/board`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        boardUid: removeBoardTarget.value.uid,
        userUid: auth.user.uid,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return admin.error(`${GENERAL.FAILED_REMOVE_BOARD} (${data.error})`)
    }

    boards.value = boards.value.filter((board) => {
      return board.uid !== removeBoardTarget.value.uid
    })

    closeRemoveBoardDialog()
    admin.success(GENERAL.REMOVED_BOARD)
  }

  return {
    group,
    removeBoardTarget,
    confirmRemoveBoardDialog,
    boards,
    suggestions,
    newGroupManager,
    newBoardId,
    existBoardIds,
    loadGeneralConfig,
    updateGroupManagerSuggestion,
    updateExistBoardIds,
    createNewBoard,
    updateGroupManager,
    confirmRemoveBoard,
    closeRemoveBoardDialog,
    removeBoard,
  }
})
