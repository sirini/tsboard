/**
 * store/admin/home/main.ts
 *
 * 각종 기본적인 수치 데이터들들의 상태 및 유유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { useAdminStore } from "../common"
import { AdminHomeSimpleStatus } from "../../../interface/admin"

export const useAdminHomeMainStore = defineStore("adminHomeMain", () => {
  const admin = useAdminStore()
  const visit = ref<AdminHomeSimpleStatus>({
    total: 789,
    yesterday: 43,
    today: 12,
  })
  const member = ref<AdminHomeSimpleStatus>({
    total: 1921,
    yesterday: 18,
    today: 5,
  })
  const post = ref<AdminHomeSimpleStatus>({
    total: 15679,
    yesterday: 76,
    today: 21,
  })

  return {
    visit,
    member,
    post,
  }
})
