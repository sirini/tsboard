/**
 * store/admin/member/general.ts
 *
 * 회원 목록 관리자 페이지에서 일반 부분에 필요한 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminMemberTable, AdminPairItem, AdminMemberReportList } from "../../../interface/admin"
import { useAdminStore } from "../common"

export const useAdminMemberGeneralStore = defineStore("adminMemberGeneral", () => {
  const admin = useAdminStore()
  const confirmBlockUserDialog = ref<boolean>(false)
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
  const reports = ref<AdminMemberReportList[]>([
    {
      content: "예시용 신고 내역 입니다. 회원이 뭔가를 잘못해서 남겨졌습니다.",
      from: { uid: 123, name: "의적단" },
      date: "2023-11-30 20:22:10",
    },
    {
      content:
        "다른 회원으로부터 받은 신고 내역입니다. 역시나 뭔가를 잘못했으며 이 회원의 문제 상황을 언급합니다.",
      from: { uid: 321, name: "스나이퍼" },
      date: "2023-11-30 20:23:20",
    },
  ])

  // 특정 사용자 차단 하기 시 확인용 다이얼로그 띄우기
  function openConfirmBlockDialog(user: AdminPairItem): void {
    blockUserTarget.value = user
    confirmBlockUserDialog.value = true
  }

  // 특정 사용자 차단하기 실행
  async function blockUser(): Promise<void> {
    if (blockUserTarget.value.uid < 1) {
      admin.snack("차단할 사용자가 제대로 지정되지 않았습니다.", "error")
      return
    }
    // do something ... axios.delete(...)
    members.value = members.value.filter((member: AdminMemberTable) => {
      return member.uid !== blockUserTarget.value.uid
    })
    admin.snack(`${blockUserTarget.value.name} 님의 로그인을 차단 하였습니다.`, "success")
    blockUserTarget.value = { uid: 0, name: "" }
  }

  return {
    confirmBlockUserDialog,
    blockUserTarget,
    option,
    search,
    members,
    reports,
    paging,
    openConfirmBlockDialog,
    blockUser,
  }
})
