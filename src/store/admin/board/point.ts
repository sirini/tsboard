import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../user/auth"
import { POINT } from "../../../messages/store/admin/board/point"
import { TSBOARD } from "../../../../tsboard.config"
import axios from "axios"
import { ADMIN_BOARD_POINT_POLICY, AdminBoardPointPolicy } from "../../../interface/admin_interface"

export const useAdminBoardPointStore = defineStore("adminBoardPoint", () => {
  const route = useRoute()
  const admin = useAdminStore()
  const auth = useAuthStore()
  const board = ref<AdminBoardPointPolicy>(ADMIN_BOARD_POINT_POLICY)
  const boardView = ref<string>("0")
  const boardWrite = ref<string>("0")
  const boardComment = ref<string>("0")
  const boardDownload = ref<string>("0")
  const payment = ref({
    view: false,
    write: false,
    comment: false,
    download: false,
  })

  // 게시판 포인트 설정 불러오기
  async function loadPointConfig(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/admin/board/point/load`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        id: route.params.id as string,
      },
    })

    if (!response.data) {
      return admin.error(POINT.NO_RESPONSE)
    }
    if (response.data.success === false) {
      return admin.error(`${POINT.UNABLE_LOAD_POINT} (${response.data.error})`)
    }

    const point = response.data.result as AdminBoardPointPolicy
    board.value = {
      uid: point.uid,
      view: point.view,
      write: point.write,
      comment: point.comment,
      download: point.download,
    }

    payment.value.view = board.value.view < 0
    payment.value.write = board.value.write < 0
    payment.value.comment = board.value.comment < 0
    payment.value.download = board.value.download < 0

    boardView.value = Math.abs(board.value.view).toString()
    boardWrite.value = Math.abs(board.value.write).toString()
    boardComment.value = Math.abs(board.value.comment).toString()
    boardDownload.value = Math.abs(board.value.download).toString()

    admin.success(POINT.LOADED_POINT)
  }

  // 글 보기 포인트 정책 업데이트
  async function updateViewPoint(isPayment: boolean, amount: string): Promise<void> {
    payment.value.view = isPayment
    board.value.view = parseInt(amount) * (isPayment ? -1 : 1)

    if ((await updateAllPoints()) === true) {
      admin.success(
        `${POINT.ACTION_VIEW} ${amount} ${
          isPayment ? POINT.RESULT_DECREASE : POINT.RESULT_INCREASE
        } ${POINT.UPDATED_ACTION_RESULT}`,
      )
    }
  }

  // 글 작성 포인트 정책 업데이트
  async function updateWritePoint(isPayment: boolean, amount: string): Promise<void> {
    payment.value.write = isPayment
    board.value.write = parseInt(amount) * (isPayment ? -1 : 1)

    if ((await updateAllPoints()) === true) {
      admin.success(
        `${POINT.ACTION_WRITE} ${amount} ${
          isPayment ? POINT.RESULT_DECREASE : POINT.RESULT_INCREASE
        } ${POINT.UPDATED_ACTION_RESULT}`,
      )
    }
  }

  // 댓글 쓰기 포인트 정책 업데이트
  async function updateCommentPoint(isPayment: boolean, amount: string): Promise<void> {
    payment.value.comment = isPayment
    board.value.comment = parseInt(amount) * (isPayment ? -1 : 1)

    if ((await updateAllPoints()) === true) {
      admin.success(
        `${POINT.ACTION_COMMENT} ${amount} ${
          isPayment ? POINT.RESULT_DECREASE : POINT.RESULT_INCREASE
        } ${POINT.UPDATED_ACTION_RESULT}`,
      )
    }
  }

  // 다운로드 포인트 정책 업데이트
  async function updateDownloadPoint(isPayment: boolean, amount: string): Promise<void> {
    payment.value.download = isPayment
    board.value.download = parseInt(amount) * (isPayment ? -1 : 1)

    if ((await updateAllPoints()) === true) {
      admin.success(
        `${POINT.ACTION_DOWNLOAD} ${amount} ${
          isPayment ? POINT.RESULT_DECREASE : POINT.RESULT_INCREASE
        } ${POINT.UPDATED_ACTION_RESULT}`,
      )
    }
  }

  // 포인트 처리
  async function updateAllPoints(): Promise<boolean> {
    const fd = new FormData()
    fd.append("boardUid", board.value.uid.toString())
    fd.append("view", board.value.view.toString())
    fd.append("write", board.value.write.toString())
    fd.append("comment", board.value.comment.toString())
    fd.append("download", board.value.download.toString())

    const response = await axios.patch(`${TSBOARD.API}/admin/board/point/update/points`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })

    if (!response.data) {
      admin.error(POINT.NO_RESPONSE)
      return false
    }
    if (response.data.success === false) {
      admin.error(`${POINT.UNABLE_UPDATE_POINT} (${response.data.error})`)
      return false
    }

    return true
  }

  return {
    board,
    boardView,
    boardWrite,
    boardComment,
    boardDownload,
    loadPointConfig,
    updateViewPoint,
    updateWritePoint,
    updateCommentPoint,
    updateDownloadPoint,
  }
})
