/**
 * store/admin/board/point
 *
 * 게시글 열람, 글작성 등에 소비되는(혹은 충전되는) 포인트 상태 및 함수들
 */

import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../../server/index"
import { AdminPoint } from "../../../interface/admin"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../auth"
import { POINT } from "../../../messages/store/admin/board/point"

export const useAdminBoardPointStore = defineStore("adminBoardPoint", () => {
  const route = useRoute()
  const admin = useAdminStore()
  const auth = useAuthStore()
  const server = edenTreaty<App>(process.env.API!)
  const board = ref<AdminPoint>({
    uid: 0,
    view: { isPayment: true, amount: 0 },
    write: { isPayment: false, amount: 0 },
    comment: { isPayment: false, amount: 0 },
    download: { isPayment: true, amount: 0 },
  })
  const boardView = ref<string>("0")
  const boardWrite = ref<string>("0")
  const boardComment = ref<string>("0")
  const boardDownload = ref<string>("0")

  // 게시판 포인트 설정 불러오기
  async function loadPointConfig(): Promise<void> {
    const response = await server.api.admin.board.point.load.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: route.params.id as string,
      },
    })

    if (!response.data) {
      admin.error(POINT.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      admin.error(`${POINT.UNABLE_LOAD_POINT} (${response.data.error})`)
      return
    }
    if (!response.data.result) {
      admin.error(POINT.UNKNOWN_INFO)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken!)
    board.value = response.data.result.point as AdminPoint
    boardView.value = board.value.view.amount.toString()
    boardWrite.value = board.value.write.amount.toString()
    boardComment.value = board.value.comment.amount.toString()
    boardDownload.value = board.value.download.amount.toString()

    admin.success(POINT.LOADED_POINT)
  }

  // 글 보기 포인트 정책 업데이트
  async function updateViewPoint(isPayment: boolean, amount: string): Promise<void> {
    board.value.view.isPayment = isPayment
    board.value.view.amount = parseInt(amount)

    if ((await updateAllPoints()) === true) {
      admin.success(
        `글 보기에 ${board.value.view.amount} 만큼 ${
          board.value.view.isPayment ? "차감" : "충전"
        } 하도록 수정 하였습니다.`,
      )
    }
  }

  // 글 작성 포인트 정책 업데이트
  async function updateWritePoint(isPayment: boolean, amount: string): Promise<void> {
    board.value.write.isPayment = isPayment
    board.value.write.amount = parseInt(amount)

    if ((await updateAllPoints()) === true) {
      admin.success(
        `글 작성에 ${board.value.write.amount} 만큼 ${
          board.value.write.isPayment ? "차감" : "충전"
        } 하도록 수정 하였습니다.`,
      )
    }
  }

  // 댓글 쓰기 포인트 정책 업데이트
  async function updateCommentPoint(isPayment: boolean, amount: string): Promise<void> {
    board.value.comment.isPayment = isPayment
    board.value.comment.amount = parseInt(amount)

    if ((await updateAllPoints()) === true) {
      admin.success(
        `댓글 쓰기에 ${board.value.comment.amount} 만큼 ${
          board.value.comment.isPayment ? "차감" : "충전"
        } 하도록 수정 하였습니다.`,
      )
    }
  }

  // 다운로드 포인트 정책 업데이트
  async function updateDownloadPoint(isPayment: boolean, amount: string): Promise<void> {
    board.value.download.isPayment = isPayment
    board.value.download.amount = parseInt(amount)

    if ((await updateAllPoints()) === true) {
      admin.success(
        `다운로드에 ${board.value.download.amount} 만큼 ${
          board.value.download.isPayment ? "차감" : "충전"
        } 하도록 수정 하였습니다.`,
      )
    }
  }

  // 포인트 처리
  async function updateAllPoints(): Promise<boolean> {
    const response = await server.api.admin.board.point.updatepoints.patch({
      $headers: {
        authorization: auth.user.token,
      },
      boardUid: board.value.uid,
      points: {
        view: board.value.view,
        write: board.value.write,
        comment: board.value.comment,
        download: board.value.download,
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
    auth.updateUserToken(response.data.result.newAccessToken!)
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
