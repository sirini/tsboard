/**
 * store/admin/member/general
 *
 * 회원 목록 관리자 페이지에서 일반 부분에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminMemberTable, AdminPairItem, AdminMemberReport } from "../../../interface/admin"
import { useAdminStore } from "../common"

export const useAdminMemberGeneralStore = defineStore("adminMemberGeneral", () => {
  const admin = useAdminStore()
  const blockUserTarget = ref<AdminPairItem>({
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
      profile: "/no-profile.png",
      level: 1,
      point: 100,
      signup: "2023-12-05",
    },
    {
      uid: 2,
      id: "example@test.com",
      name: "최고맨",
      profile: "/no-profile.png",
      level: 1,
      point: 100,
      signup: "2023-12-07",
    },
    {
      uid: 3,
      id: "sample@test.com",
      name: "김예제",
      profile: "/no-profile.png",
      level: 1,
      point: 100,
      signup: "2023-12-09",
    },
  ])
  const reports = ref<AdminMemberReport[]>([
    {
      to: { uid: 12, name: "악당1" },
      from: { uid: 123, name: "의적단" },
      request: "예시용 신고 내역 입니다. 회원이 뭔가를 잘못해서 남겨졌습니다.",
      response: "",
      date: "2023-11-30 20:22:10",
    },
    {
      to: { uid: 12, name: "악당1" },
      from: { uid: 123, name: "의적단" },
      request:
        "다른 회원으로부터 받은 신고 내역입니다. 역시나 뭔가를 잘못했으며 이 회원의 문제 상황을 언급합니다.",
      response: "",
      date: "2023-12-10 20:22:10",
    },
  ])

  return {
    blockUserTarget,
    option,
    search,
    members,
    reports,
    paging,
  }
})
