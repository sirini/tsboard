/**
 * store/admin/report/general.ts
 *
 * 신고 내역 조회 및 조치에 필요한 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { useAdminStore } from "../common"
import { AdminMemberReport } from "../../../interface/admin"

export const useAdminReportGeneralStore = defineStore("adminReportGeneral", () => {
  const admin = useAdminStore()
  const option = ref<"reporterName" | "reporterContent" | "targetName">("reporterContent")
  const search = ref<string>("")
  const paging = ref<number>(1)
  const reports = ref<AdminMemberReport[]>([
    {
      content: "신고 내용 예시 1",
      from: { uid: 111, name: "경찰1", profile: "/no-profile.png" },
      to: { uid: 222, name: "악당1", profile: "/no-profile.png" },
      date: "2023-12-03",
    },
    {
      content: "신고 내용 예시 2",
      from: { uid: 111, name: "경찰2", profile: "/no-profile.png" },
      to: { uid: 222, name: "악당2", profile: "/no-profile.png" },
      date: "2023-12-03",
    },
    {
      content:
        "신고 내용 예시 3 좀 길게 기이이일게 작성해 봅니다. 긴 글의 경우에는 여러 줄로 표시될 것입니다. 표시되는 내용을 자를지 말지 고민이 좀 필요하네요.",
      from: { uid: 111, name: "경찰3", profile: "/no-profile.png" },
      to: { uid: 222, name: "악당3", profile: "/no-profile.png" },
      date: "2023-12-03",
    },
  ])

  return {
    option,
    search,
    paging,
    reports,
  }
})
