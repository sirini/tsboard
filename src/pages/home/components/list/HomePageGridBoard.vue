<template>
  <v-card class="box-board" :color="home.color.header">
    <v-list class="pa-0" :bg-color="home.color.header"
      ><v-list-item
        @click="util.go(boardType, id)"
        class="board-name"
        append-icon="mdi-chevron-right"
        >{{ util.unescape(board.name) }}</v-list-item
      ></v-list
    >
    <v-divider></v-divider>
    <v-card-text class="pa-0">
      <v-list class="pa-0" :bg-color="home.color.header">
        <v-list-item
          v-for="(post, index) in board.latest"
          :key="index"
          @click="util.go(post.type, id, post.uid)"
        >
          <template v-slot:prepend>
            <v-chip size="small" :color="home.color.header" v-if="post.useCategory">{{
              util.unescape(post.category)
            }}</v-chip>

            <v-chip
              size="small"
              :color="home.color.header"
              prepend-icon="mdi-heart-outline"
              v-else
              >{{ util.num(post.like) }}</v-chip
            >
          </template>

          <v-list-item-title class="pl-2 pr-2 post-title"
            >{{ util.unescape(post.title) }}
            <v-chip size="small" :color="home.color.header" class="ml-2" v-if="post.comment > 0">{{
              util.num(post.comment)
            }}</v-chip></v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { BOARD_TYPE } from "../../../../../server/database/board/const"
import { BoardType } from "../../../../interface/board"
import { BoardLatest, LatestPost } from "../../../../interface/home"
import { useHomeStore } from "../../../../store/home"
import { useUtilStore } from "../../../../store/util"

const util = useUtilStore()
const home = useHomeStore()
const props = defineProps<{
  id: string
  limit: number
}>()
const board = ref<BoardLatest>({
  name: "",
  latest: [] as LatestPost[],
})
const boardType = ref<BoardType>(BOARD_TYPE.BOARD as BoardType)

onMounted(async () => {
  board.value = await home.getBoardLatest(props.id, props.limit)
  if (board.value.latest.length > 0) {
    boardType.value = board.value.latest[0].type
  }
})
</script>

<style scoped>
.box-board {
  height: 300px;
}
.board-name {
  font-weight: bold;
}
.post-title {
  font-size: 1em;
  cursor: pointer;
}
</style>
