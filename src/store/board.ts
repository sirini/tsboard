/**
 * store/board
 *
 * 게시판 동작과 관련한 상태 및 함수들
 */

import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { Pair } from "../interface/board"

export const useBoardStore = defineStore("board", () => {
  const route = useRoute()
  const id = ref<string>(route.params?.id.toString())
  const uid = ref<number>(0)

  const categories = ref<Pair[]>([
    { uid: 1, name: "news" },
    { uid: 2, name: "test" },
    { uid: 3, name: "sample" },
  ])

  // 좋아요 누르기
  function like(uid: number): void {
    // do something
  }

  return {
    id,
    uid,
    categories,
    like,
  }
})
