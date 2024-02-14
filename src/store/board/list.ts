/**
 * store/board
 *
 * 게시판 동작과 관련한 상태 및 함수들
 */

import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../server/index"
import { useAuthStore } from "../auth"
import { Pair, Post } from "../../interface/board"

export const useBoardListStore = defineStore("boardList", () => {
  const server = edenTreaty<App>(process.env.API!)
  const route = useRoute()
  const auth = useAuthStore()
  const id = ref<string>(route.params.id as string)
  const posts = ref<Post[]>([])
  const categories = ref<Pair[]>([])
  const page = ref<number>(1)
  const pageLength = ref<number>(5)
  const bunch = ref<number>(20)

  async function loadBoardConfig(): Promise<void> {
    const response = await server.api.board.list.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: id.value,
      },
    })
    if (!response.data) {
      // TODO
    }
  }

  return {
    id,
    posts,
    page,
    pageLength,
    bunch,
    categories,
  }
})
