/**
 * store/admin/member/block.ts
 *
 * 차단된 회원 목록 보는 페이지에 필요한 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { useAdminStore } from "../common"
import { AdminMemberTable, AdminPairItem } from "../../../interface/admin"

export const useAdminMemberBlockStore = defineStore("adminMemberBlock", () => {
  const admin = useAdminStore()
  const option = ref<"name" | "id" | "level">("name")
  const search = ref<string>("")
  const paging = ref<number>(1)
  const members = ref<AdminMemberTable[]>([
    {
      uid: 123,
      id: "troll@test.com",
      name: "트롤맨",
      profile: "/no-profile.png",
      level: 1,
      point: 100,
      signup: "2023-12-05",
    },
    {
      uid: 1,
      id: "psy@test.com",
      name: "싸이쿠",
      profile: "/no-profile.png",
      level: 1,
      point: 100,
      signup: "2023-12-05",
    },
  ])

  // 차단된 회원을 다시 풀어주기
  async function unblock(target: AdminPairItem): Promise<void> {
    // do something axios.put(...)
    members.value = members.value.filter((member: AdminMemberTable) => {
      return member.uid !== target.uid
    })
    admin.snack(`${target.name}님을 차단 해제하였습니다.`, "success")
  }

  return {
    option,
    search,
    paging,
    members,
    unblock,
  }
})
