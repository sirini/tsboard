/**
 * store/admin/board/point.ts
 *
 * 게시글 열람, 글작성 등에 소비되는(혹은 충전되는) 포인트 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminBoardPoint } from "../../../interface/admin"
import { useAdminStore } from "../common"
import { useAdminBoardGeneralStore } from "./general"

export const useAdminBoardPointStore = defineStore("adminBoardPoint", () => {
  const admin = useAdminStore()
  const general = useAdminBoardGeneralStore()
  const view = ref<AdminBoardPoint>({ payment: 1, point: 0 })
  const write = ref<AdminBoardPoint>({ payment: 0, point: 0 })
  const comment = ref<AdminBoardPoint>({ payment: 0, point: 0 })
  const download = ref<AdminBoardPoint>({ payment: 1, point: 0 })

  // 글보기 시 포인트 처리
  async function dealView(): Promise<void> {
    // do something with view.value
    const action = view.value.payment === 1 ? "지불" : "충전"
    admin.snack(`글보기에 ${view.value.point} 씩 ${action} 하도록 설정 하였습니다.`, "success")
  }

  return {
    view,
    write,
    comment,
    download,
    dealView,
  }
})
