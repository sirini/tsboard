/**
 * store/admin/board/point
 *
 * 게시글 열람, 글작성 등에 소비되는(혹은 충전되는) 포인트 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminBoardPointList } from "../../../interface/admin"
import { useAdminStore } from "../common"

export const useAdminBoardPointStore = defineStore("adminBoardPoint", () => {
  const admin = useAdminStore()
  const deal = ref<AdminBoardPointList>({
    view: { isPayment: true, amount: 0 },
    write: { isPayment: false, amount: 0 },
    comment: { isPayment: false, amount: 0 },
    download: { isPayment: true, amount: 0 },
  })

  // 글 보기 포인트 정책 업데이트
  function updateViewPointRule(isPayment: boolean, amount: number): void {
    deal.value.view = {
      isPayment,
      amount,
    }
    updateAllPointRules()
    admin.snack(
      `글 보기에 ${amount} 만큼 ${isPayment ? "차감" : "충전"} 하도록 수정 하였습니다.`,
      "success",
    )
  }

  // 글 작성 포인트 정책 업데이트
  function updateWritePointRule(isPayment: boolean, amount: number): void {
    deal.value.write = {
      isPayment,
      amount,
    }
    updateAllPointRules()
    admin.snack(
      `글 작성에 ${amount} 만큼 ${isPayment ? "차감" : "충전"} 하도록 수정 하였습니다.`,
      "success",
    )
  }

  // 댓글 쓰기 포인트 정책 업데이트
  function updateCommentPointRule(isPayment: boolean, amount: number): void {
    deal.value.comment = {
      isPayment,
      amount,
    }
    updateAllPointRules()
    admin.snack(
      `댓글 쓰기에 ${amount} 만큼 ${isPayment ? "차감" : "충전"} 하도록 수정 하였습니다.`,
      "success",
    )
  }

  // 다운로드 포인트 정책 업데이트
  function updateDownloadPointRule(isPayment: boolean, amount: number): void {
    deal.value.download = {
      isPayment,
      amount,
    }
    updateAllPointRules()
    admin.snack(
      `다운로드에 ${amount} 만큼 ${isPayment ? "차감" : "충전"} 하도록 수정 하였습니다.`,
      "success",
    )
  }

  // 포인트 처리
  async function updateAllPointRules(): Promise<void> {
    // axios.put('some path', point.value) ...
  }

  return {
    deal,
    updateViewPointRule,
    updateWritePointRule,
    updateCommentPointRule,
    updateDownloadPointRule,
  }
})
