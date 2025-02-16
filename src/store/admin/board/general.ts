import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import { GENERAL } from "../../../messages/store/admin/board/general"
import { TSBOARD } from "../../../../tsboard.config"
import axios from "axios"
import { BOARD, BOARD_CONFIG, BoardConfig, Pair } from "../../../interface/board_interface"
import { AdminBoardResult } from "../../../interface/admin_interface"
import { CODE, ResponseData } from "../../../interface/util_interface"
import { ADMIN } from "../../../messages/store/admin/admin"

export const useAdminBoardGeneralStore = defineStore("adminBoardGeneral", () => {
  const route = useRoute()
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const confirmRemoveCategoryDialog = ref<boolean>(false)
  const groups = ref<Pair[]>([])
  const board = ref<BoardConfig>(BOARD_CONFIG)
  const boardGroupName = ref<string>("")
  const boardRows = ref<string>("20")
  const boardWidth = ref<string>("1000")
  const boardAddCategory = ref<string>("")
  const boardUseCategory = ref<boolean>(true)
  const boardRemoveCategory = ref<Pair>({ uid: 0, name: "" })

  // 게시판 일반 설정 불러오기
  async function loadGeneralConfig(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/admin/board/general/load`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        id: route.params.id as string,
      },
    })

    const data = response.data as ResponseData<AdminBoardResult>
    if (!data || data.success === false) {
      if (data.code === CODE.INVALID_TOKEN && (await auth.updateAccessToken()) === true) {
        return admin.error(ADMIN.NEED_REFRESH)
      }
      return admin.error(`${GENERAL.UNABLE_LOAD_CONFIG} (${data.error})`)
    }

    groups.value = data.result.groups
    board.value = data.result.config

    board.value.name = util.unescape(board.value.name)
    board.value.info = util.unescape(board.value.info)
    boardRows.value = board.value.rowCount.toString()
    boardWidth.value = board.value.width.toString()
    boardUseCategory.value = board.value.useCategory
    admin.success(GENERAL.LOADED_CONFIG)
  }

  // 그룹 이름 업데이트하기
  function updateGroupName(): void {
    const matchedGroup = groups.value.find((group: Pair) => group.uid === board.value.groupUid)
    boardGroupName.value = matchedGroup ? matchedGroup.name : ""
  }

  // 그룹 변경하기
  async function changeGroup(group: Pair): Promise<void> {
    const fd = new FormData()
    fd.append("boardUid", board.value.uid.toString())
    fd.append("groupUid", group.uid.toString())

    const response = await axios.patch(`${TSBOARD.API}/admin/board/general/change/group`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return admin.error(`${GENERAL.UNABLE_UPDATE_GROUP} (${data.error})`)
    }
    board.value.groupUid = group.uid
    admin.success(
      `${board.value.id} ${GENERAL.CHANGED_GROUP1} ${group.name} ${GENERAL.CHANGED_GROUP2}`,
    )
  }

  // 게시판 이름 변경하기
  async function updateName(): Promise<void> {
    const newName = board.value.name.trim()
    if (newName.length < 2) {
      return admin.error(GENERAL.TOO_SHORT_CATEGORY)
    }

    const fd = new FormData()
    fd.append("boardUid", board.value.uid.toString())
    fd.append("newName", newName)

    const response = await axios.patch(`${TSBOARD.API}/admin/board/general/change/name`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return admin.error(`${GENERAL.UNABLE_UPDATE_BOARD_NAME} (${data.error})`)
    }
    admin.success(`${GENERAL.CHANGED_NAME1} ${newName} ${GENERAL.CHANGED_NAME2}`)
  }

  // 게시판 설명 변경하기
  async function updateInfo(): Promise<void> {
    const newInfo = board.value.info.trim()
    if (newInfo.length < 2) {
      return admin.error(GENERAL.TOO_SHORT_NAME)
    }

    const fd = new FormData()
    fd.append("boardUid", board.value.uid.toString())
    fd.append("newInfo", newInfo)

    const response = await axios.patch(`${TSBOARD.API}/admin/board/general/change/info`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return admin.error(`${GENERAL.UNABLE_UPDATE_BOARD_INFO} (${data.error})`)
    }
    admin.success(GENERAL.UPDATED_INFO)
  }

  // 게시판 타입 변경하기
  async function changeType(): Promise<void> {
    const fd = new FormData()
    fd.append("boardUid", board.value.uid.toString())
    fd.append("newType", board.value.type.toString())

    const response = await axios.patch(`${TSBOARD.API}/admin/board/general/change/type`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return admin.error(`${GENERAL.UNABLE_CHANGE_TYPE} (${data.error})`)
    }

    let typeName = "게시판 (board)"
    if (board.value.type === BOARD.GALLERY) {
      typeName = "갤러리 (gallery)"
    } else if (board.value.type === BOARD.BLOG) {
      typeName = "블로그 (blog)"
    } else if (board.value.type === BOARD.WEBZINE) {
      typeName = "웹진 (webzine)"
    } else if (board.value.type === BOARD.TRADE) {
      typeName = "거래 (trade)"
    }
    admin.success(`${GENERAL.CHANGED_TYPE1} ${typeName} ${GENERAL.CHANGED_TYPE2}`)
  }

  // 한 페이지에 표시할 게시글 개수 변경하기
  async function updateRows(): Promise<void> {
    const newRows = parseInt(boardRows.value)
    if (newRows < 1 || newRows > 100) {
      admin.error(GENERAL.ROWS_LIMITATION)
      boardRows.value = "20"
      return
    }

    const fd = new FormData()
    fd.append("boardUid", board.value.uid.toString())
    fd.append("newRows", newRows.toString())

    const response = await axios.patch(`${TSBOARD.API}/admin/board/general/change/rows`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return admin.error(`${GENERAL.UNABLE_UPDATE_ROWS} (${data.error})`)
    }
    admin.success(`${newRows} ${GENERAL.UPDATED_ROWS}`)
  }

  // 게시판 최대 너비 지정하기
  async function updateWidth(): Promise<void> {
    const newWidth = parseInt(boardWidth.value)
    if (newWidth < 300 || newWidth > 3000) {
      admin.error(GENERAL.WIDTH_LIMITATION)
      boardWidth.value = "1000"
      return
    }

    const fd = new FormData()
    fd.append("boardUid", board.value.uid.toString())
    fd.append("newWidth", newWidth.toString())

    const response = await axios.patch(`${TSBOARD.API}/admin/board/general/change/width`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return admin.error(`${GENERAL.UNABLE_UPDATE_WIDTH} (${data.error})`)
    }
    admin.success(`${GENERAL.CHANGED_WIDTH1} ${newWidth} ${GENERAL.CHANGED_WIDTH2}`)
  }

  // 카테고리 추가하기
  async function addCategory(): Promise<void> {
    const newCategory = boardAddCategory.value.trim()
    boardAddCategory.value = ""
    if (newCategory.length < 2) {
      return admin.error(GENERAL.TOO_SHORT_CATEGORY)
    }

    const fd = new FormData()
    fd.append("boardUid", board.value.uid.toString())
    fd.append("newCategory", newCategory)

    const response = await axios.post(`${TSBOARD.API}/admin/board/general/add/category`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return admin.error(`${GENERAL.UNABLE_ADD_CATEGORY} (${data.error})`)
    }

    board.value.category.push({
      uid: response.data.result as number,
      name: newCategory,
    })
    admin.success(`${newCategory} ${GENERAL.ADDED_CATEGORY}`)
  }

  // 카테고리 삭제 전 확인하기
  function confirmRemoveCategory(uid: number, name: string): void {
    if (board.value.category.length < 2) {
      return admin.error(GENERAL.REMOVE_LAST_CATEGORY)
    }
    boardRemoveCategory.value.uid = uid
    boardRemoveCategory.value.name = name
    confirmRemoveCategoryDialog.value = true
  }

  // 카테고리 삭제하기
  async function removeCategory(): Promise<void> {
    if (board.value.category.length < 2) {
      return admin.error(GENERAL.REMOVE_LAST_CATEGORY)
    }

    const response = await axios.delete(`${TSBOARD.API}/admin/board/general/remove/category`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        boardUid: board.value.uid,
        categoryUid: boardRemoveCategory.value.uid,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return admin.error(`${GENERAL.UNABLE_REMOVE_CATEGORY} (${data.error})`)
    }

    board.value.category = board.value.category.filter((cat: Pair) => {
      return cat.uid !== boardRemoveCategory.value.uid
    })
    admin.success(GENERAL.REMOVED_CATEGORY)
  }

  // 카테고리 사용 여부 설정하기
  async function useCategory(): Promise<void> {
    const fd = new FormData()
    fd.append("boardUid", board.value.uid.toString())
    fd.append("useCategory", boardUseCategory.value ? "1" : "0")

    const response = await axios.patch(`${TSBOARD.API}/admin/board/general/use/category`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return admin.error(`${GENERAL.FAILED_CHANGE_USE_CATEGORY} (${data.error})`)
    }
    admin.success(GENERAL.CHANGED_USE_CATEGORY)
  }

  return {
    groups,
    board,
    boardGroupName,
    boardRows,
    boardWidth,
    boardAddCategory,
    boardUseCategory,
    boardRemoveCategory,
    confirmRemoveCategoryDialog,
    loadGeneralConfig,
    updateGroupName,
    changeGroup,
    updateName,
    updateInfo,
    changeType,
    updateRows,
    updateWidth,
    addCategory,
    confirmRemoveCategory,
    removeCategory,
    useCategory,
  }
})
