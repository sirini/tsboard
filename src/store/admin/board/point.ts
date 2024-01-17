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
import { AdminBoardPointList, AdminPoint } from "../../../interface/admin"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../auth"
import { POINT } from "../../../messages/store/admin/board/point"

export const useAdminBoardPointStore = defineStore("adminBoardPoint", () => {
  const route = useRoute()
  const admin = useAdminStore()
  const auth = useAuthStore()
  const server = edenTreaty<App>(process.env.API!)
  const board = ref<AdminBoardPointList>({
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
    if (response.data.result.point.uid < 1) {
      admin.error(POINT.UNKNOWN_INFO)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken!)
    board.value = response.data.result.point as AdminPoint
    admin.success(POINT.LOADED_POINT)
  }

  // 글 보기 포인트 정책 업데이트
  function updateViewPoint(): void {
    board.value.view = {
      isPayment,
      amount,
    }
    updateAllPoints()
    admin.success(`글 보기에 ${amount} 만큼 ${isPayment ? "차감" : "충전"} 하도록 수정 하였습니다.`)
  }

  // 글 작성 포인트 정책 업데이트
  function updateWritePoint(): void {
    board.value.write = {
      isPayment,
      amount,
    }
    updateAllPoints()
    admin.success(`글 작성에 ${amount} 만큼 ${isPayment ? "차감" : "충전"} 하도록 수정 하였습니다.`)
  }

  // 댓글 쓰기 포인트 정책 업데이트
  function updateCommentPoint(): void {
    board.value.comment = {
      isPayment,
      amount,
    }
    updateAllPoints()
    admin.success(
      `댓글 쓰기에 ${amount} 만큼 ${isPayment ? "차감" : "충전"} 하도록 수정 하였습니다.`,
    )
  }

  // 다운로드 포인트 정책 업데이트
  function updateDownloadPoint(): void {
    board.value.download = {
      isPayment,
      amount,
    }
    updateAllPoints()
    admin.success(
      `다운로드에 ${amount} 만큼 ${isPayment ? "차감" : "충전"} 하도록 수정 하였습니다.`,
    )
  }

  // 포인트 처리
  async function updateAllPoints(): Promise<void> {
    // axios.put('some path', point.value) ...
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
