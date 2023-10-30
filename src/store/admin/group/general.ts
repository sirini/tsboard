/**
 * store/admin/group/general.ts
 *
 * 게시판 그룹 관리자 페이지에서 일반 부분에 필요한 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminPairItem } from "../../../interface/admin"
import { useAdminStore } from "../common"

export const useAdminGroupGeneralStore = defineStore("adminGroupGeneral", () => {
  const admin = useAdminStore()
  const group = ref<{
    uid: number
    id: string
    width: number
    rows: number
  }>({
    uid: 1,
    id: "default",
    width: 1200,
    rows: 20,
  })

  return {
    group,
  }
})
