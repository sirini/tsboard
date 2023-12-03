/**
 * store/admin/latest/post.ts
 *
 * 최신 글 조회 및 관리에 필요한 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { useAdminStore } from "../common"
import { AdminLatestPost } from "../../../interface/admin"

export const useAdminLatestPostStore = defineStore("adminLatestPost", () => {
  const admin = useAdminStore()
  const option = ref<"name" | "content">("content")
  const search = ref<string>("")
  const posts = ref<AdminLatestPost[]>([
    {
      id: "test",
      uid: 12,
      title: "최근 글 제목 테스트 1",
      writer: {
        uid: 2,
        name: "테스트맨",
        profile: "/no-profile.png",
      },
      comment: 2,
      like: 1,
      hit: 105,
      date: "2023-12-03 17:31:21",
    },
    {
      id: "test",
      uid: 13,
      title:
        "최근 글 제목인데 이번에는 엄청 긴 제목을 형성해 봅니다. 이런 긴 제목들은 보통 끝에 ... 으로 잘리게 됩니다.",
      writer: {
        uid: 3,
        name: "홍길동",
        profile: "/no-profile.png",
      },
      comment: 1,
      like: 0,
      hit: 85,
      date: "2023-12-03 18:04:10",
    },
  ])

  return {
    option,
    search,
    posts,
  }
})
