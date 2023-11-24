/**
 * store/admin/member/general.ts
 *
 * 회원 목록 관리자 페이지에서 일반 부분에 필요한 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminMemberTable } from "../../../interface/admin"
import { useAdminStore } from "../common"

export const useAdminMemberGeneralStore = defineStore("adminMemberGeneral", () => {
  const admin = useAdminStore()
  const option = ref<0 | 1 | 2>(0)
  const search = ref<string>("")
  const paging = ref<number>(1)
  const members = ref<AdminMemberTable[]>([
    {
      uid: 1,
      profile: "/no-profile.png",
      id: "test@test.com",
      name: "홍길동",
      point: 100,
      level: 1,
      signupDate: "2023-11-24",
    },
    {
      uid: 2,
      profile: "/no-profile.png",
      id: "example@hoho.com",
      name: "김예제",
      point: 100,
      level: 1,
      signupDate: "2023-11-24",
    },
    {
      uid: 3,
      profile: "/no-profile.png",
      id: "sample@uhhha.com",
      name: "박샘플",
      point: 100,
      level: 1,
      signupDate: "2023-11-24",
    },
  ])

  return {
    option,
    search,
    members,
    paging,
  }
})
