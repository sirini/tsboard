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
import { useUtilStore } from "../util"
import { BoardConfig, Pair, Post } from "../../interface/board"
import { LIST } from "../../messages/store/board/list"

export const useBoardListStore = defineStore("boardList", () => {
  const server = edenTreaty<App>(process.env.API!)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const id = ref<string>(route.params.id as string)
  const config = ref<BoardConfig>({
    uid: 0,
    admin: {
      group: 0,
      board: 0,
    },
    type: 0,
    name: "",
    info: "",
    row: 0,
    width: 0,
    useCategory: false,
    category: [],
    level: {
      list: 0,
      view: 0,
      comment: 0,
      write: 0,
      download: 0,
    },
    point: {
      view: 0,
      comment: 0,
      write: 0,
      download: 0,
    },
  })
  const posts = ref<Post[]>([])
  const categories = ref<Pair[]>([])
  const page = ref<number>(1)
  const pageLength = ref<number>(5)
  const bunch = ref<number>(20)

  async function loadBoardConfig(): Promise<void> {
    const response = await server.api.board.config.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: id.value,
      },
    })
    if (!response.data) {
      util.snack(LIST.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.snack(`${LIST.FAILED_LOAD_CONFIG} (${response.data.error})`)
      return
    }
    if (!response.data.result) {
      util.snack(LIST.FAILED_LOAD_CONFIG)
      return
    }
    config.value = response.data.result.config as BoardConfig
  }

  return {
    id,
    posts,
    page,
    pageLength,
    bunch,
    categories,
    loadBoardConfig,
  }
})
