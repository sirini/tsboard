/**
 * store/admin/home/main
 *
 * 각종 기본적인 수치 데이터들들의 상태 및 유함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { useAdminStore } from "../common"
import { AdminHomeSimpleStatus } from "../../../interface/admin"

export interface AdminHomeDate {
  year: string
  month: string
  date: string
}

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

  // 현재 연월일 반환
  function today(): AdminHomeDate {
    let result = ""
    const d = new Date()
    const year = `${d.getFullYear()}`
    const month = `0${d.getMonth() + 1}`.slice(1)
    const date = `0${d.getDate()}`.slice(1)
    return {
      year,
      month,
      date,
    }
  }

  return {
    visit,
    member,
    post,
    today,
  }
})
