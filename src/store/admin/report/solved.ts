/**
 * store/admin/report/solved
 *
 * 조치 완료된 신고 내역 조회에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { useAdminStore } from "../common"
import { AdminMemberReport } from "../../../interface/admin"

export const useAdminReportSolvedStore = defineStore("adminReportSolved", () => {
  const admin = useAdminStore()
  const option = ref<"reporter" | "request" | "target">("request")
  const search = ref<string>("")
  const paging = ref<number>(1)
  const reports = ref<AdminMemberReport[]>([
    {
      to: { uid: 123, name: "조치된 악당1", profile: "/no-profile.svg" },
      from: { uid: 111, name: "경찰1", profile: "/no-profile.svg" },
      request: "신고 내역 예시 첫번째 입니다. 무언가 이 회원이 짜증나게 한 게 있을 겁니다.",
      response: "악질적인 광고성 글 도배로 인해 차단 조치 하였습니다.",
      date: "2023-12-03",
    },
    {
      to: { uid: 234, name: "차단된 악당2", profile: "/no-profile.svg" },
      from: { uid: 111, name: "경찰2", profile: "/no-profile.svg" },
      request:
        "신고 내역 예시 두번째 입니다. 무언가 이 회원이 짜증나게 한 게 있을 겁니다. 신고 내용은 1000자까지 작성 가능하니까 조금만 더 길게 써보도록 하겠습니다. 과연 어떤 회원들이 어떠한 사유로 신고를 받게 되었을까요?",
      response: "경미한 트롤 행위로 인해 글 작성 권한만 제거 하였습니다.",
      date: "2023-12-05",
    },
    {
      to: { uid: 345, name: "약한 처벌받은 악당3", profile: "/no-profile.svg" },
      from: { uid: 111, name: "경찰3", profile: "/no-profile.svg" },
      request: "신고 내역 예시 세번째 입니다. 무언가 이 회원이 짜증나게 한 게 있을 겁니다.",
      response: "성적인 내용의 게시글을 몇차례 올려 글/댓글 작성 권한을 제거 하였습니다.",
      date: "2023-12-10",
    },
  ])

  return {
    option,
    search,
    paging,
    reports,
  }
})
