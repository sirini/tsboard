/**
 * store/admin/board/point.ts
 *
 * 게시글 열람, 글작성 등에 소비되는(혹은 충전되는) 포인트 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminBoardPoint } from "../../../interface/admin"
import { useAdminStore } from "../common"

export const ACTION = {
  VIEW: 0,
  WRITE: 1,
  COMMENT: 2,
  DOWNLOAD: 3,
}

export const useAdminBoardPointStore = defineStore("adminBoardPoint", () => {
  const admin = useAdminStore()
  const view = ref<AdminBoardPoint>({ payment: 1, point: 0 })
  const write = ref<AdminBoardPoint>({ payment: 0, point: 0 })
  const comment = ref<AdminBoardPoint>({ payment: 0, point: 0 })
  const download = ref<AdminBoardPoint>({ payment: 1, point: 0 })
  const actions = [
    { name: "글보기", target: view },
    { name: "글쓰기", target: write },
    { name: "댓글 쓰기", target: comment },
    { name: "다운로드", target: download },
  ]

  // 포인트 처리
  async function deal(type: number, payment: 0 | 1, point: number): Promise<void> {
    actions[type].target.value.payment = payment
    actions[type].target.value.point = point

    // do something with view.value
    const act = payment === 1 ? "지불" : "충전"
    admin.snack(`${actions[type].name} 에 ${point} 씩 ${act} 하도록 설정 하였습니다.`, "success")
  }

  return {
    view,
    write,
    comment,
    download,
    deal,
  }
})
