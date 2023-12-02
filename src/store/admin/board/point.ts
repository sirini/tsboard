/**
 * store/admin/board/point.ts
 *
 * 게시글 열람, 글작성 등에 소비되는(혹은 충전되는) 포인트 상태 및 유틸리티 함수들
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
  }

  // 글 작성 포인트 정책 업데이트
  function updateWritePointRule(isPayment: boolean, amount: number): void {
    deal.value.write = {
      isPayment,
      amount,
    }
    updateAllPointRules()
  }

  // 댓글 쓰기 포인트 정책 업데이트
  function updateCommentPointRule(isPayment: boolean, amount: number): void {
    deal.value.comment = {
      isPayment,
      amount,
    }
    updateAllPointRules()
  }

  // 다운로드 포인트 정책 업데이트
  function updateDownloadPointRule(isPayment: boolean, amount: number): void {
    deal.value.download = {
      isPayment,
      amount,
    }
    updateAllPointRules()
  }

  // 포인트 처리
  async function updateAllPointRules(): Promise<void> {
    // axios.put('some path', point.value) ...
    admin.snack(`포인트 충전/차감 내역을 업데이트 하였습니다.`, "success")
  }

  return {
    deal,
    updateViewPointRule,
    updateWritePointRule,
    updateCommentPointRule,
    updateDownloadPointRule,
  }
})
