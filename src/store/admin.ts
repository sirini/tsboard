/**
 * store/admin.ts
 *
 * 관리자 페이지에서 사용되는 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { BoardGroup } from "../interface/admin"

export const useAdminStore = defineStore("admin", () => {
  const group = ref<BoardGroup[]>([{
    uid: 1,
    name: "기본 게시판 그룹",
    manager: 1,
    boards: [{
      uid: 1,
      name: "테스트 게시판",
      info: "기본 게시판입니다",
      manager: 1,
    }]
  },{
    uid: 2,
    name: "기본 갤러리 그룹",
    manager: 1,
    boards: [{
      uid: 1,
      name: "테스트 갤러리",
      info: "기본 갤러리입니다",
      manager: 1,
    }]
  }])

  return {
    group,
  }
})