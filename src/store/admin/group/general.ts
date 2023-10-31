/**
 * store/admin/group/general.ts
 *
 * 게시판 그룹 관리자 페이지에서 일반 부분에 필요한 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { AdminPairItem, AdminGroupList } from "../../../interface/admin"
import { useAdminStore } from "../common"

export const useAdminGroupGeneralStore = defineStore("adminGroupGeneral", () => {
  const admin = useAdminStore()
  const group = ref<AdminPairItem>({
    uid: 1,
    name: "default",
  })
  const boards = ref<AdminGroupList[]>([
    { uid: 1, id: "test", info: "테스트용 게시판 입니다.", admin: "master01" },
    { uid: 2, id: "test2", info: "테스트용 게시판 2 입니다.", admin: "master02" },
    { uid: 3, id: "free", info: "자유롭게 얘기 나눌 수 있는 게시판입니다.", admin: "master03" },
  ])

  return {
    group,
    boards,
  }
})
