/**
 * store/admin/member/general
 *
 * 회원 목록 관리자 페이지에서 일반 부분에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminMemberTable, AdminPair, AdminReport } from "../../../interface/admin"
import { useAdminStore } from "../common"

export const useAdminMemberGeneralStore = defineStore("adminMemberGeneral", () => {
  const admin = useAdminStore()
  const blockUserTarget = ref<AdminPair>({
    uid: 0,
    name: "",
  })
  const option = ref<"name" | "id" | "level">("name")
  const search = ref<string>("")
  const paging = ref<number>(1)
  const members = ref<AdminMemberTable[]>([
    {
      uid: 1,
      id: "test@test.com",
      name: "홍길동",
      profile: "/no-profile.svg",
      level: 1,
      point: 100,
      signup: "2023-12-05",
    },
    {
      uid: 2,
      id: "example@test.com",
      name: "최고맨",
      profile: "/no-profile.svg",
      level: 1,
      point: 100,
      signup: "2023-12-07",
    },
    {
      uid: 3,
      id: "sample@test.com",
      name: "김예제",
      profile: "/no-profile.svg",
      level: 1,
      point: 100,
      signup: "2023-12-09",
    },
  ])
  const reports = ref<AdminReport[]>([])

  return {
    blockUserTarget,
    option,
    search,
    members,
    reports,
    paging,
  }
})
