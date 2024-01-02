/**
 * store/admin/latest/comment
 *
 * 최신 댓글 조회 및 관리에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { useAdminStore } from "../common"
import { AdminLatestComment } from "../../../interface/admin"

export const useAdminLatestCommentStore = defineStore("adminLatestComment", () => {
  const admin = useAdminStore()
  const option = ref<"name" | "content">("content")
  const search = ref<string>("")
  const comments = ref<AdminLatestComment[]>([
    {
      id: "test",
      uid: 12,
      content: "최근 댓글 제목 테스트 1",
      writer: {
        uid: 2,
        name: "테스트 댓글맨",
        profile: "/no-profile.png",
      },
      like: 1,
      date: "2023-12-03 19:20:11",
    },
    {
      id: "test",
      uid: 13,
      content:
        "최근 댓글 내용인데 이번에는 엄청 긴 제목을 형성해 봅니다. 이런 긴 내용들은 보통 끝에 ... 으로 잘리게 됩니다.",
      writer: {
        uid: 3,
        name: "홍길동 댓글",
        profile: "/no-profile.png",
      },
      like: 0,
      date: "2023-12-03 19:21:14",
    },
  ])

  return {
    option,
    search,
    comments,
  }
})
