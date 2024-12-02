<template>
  <div v-for="(board, index) in boards" :key="index">
    <v-chip
      label
      :prepend-icon="ICONS[board.type]"
      size="large"
      :color="home.color.header"
      class="mt-6 mb-3 mr-3"
      @click="util.go(board.type, board.id)"
    >
      <strong>{{ util.unescape(board.name) }}</strong>
      <v-divider vertical class="ml-3 mr-3"></v-divider>
      {{ util.unescape(board.info) }}
    </v-chip>

    <v-row class="mb-3">
      <v-col v-for="(post, index) in board.posts" :key="index" :cols="home.cols">
        <home-page-board-latest-grid
          :type="board.type"
          :id="board.id"
          :use-category="board.useCategory"
          :post="post"
        ></home-page-board-latest-grid>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { BoardLatestPost } from "../../interface/home"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import HomePageBoardLatestGrid from "./components/list/HomePageBoardLatestGrid.vue"

const home = useHomeStore()
const util = useUtilStore()

const boards = ref<BoardLatestPost[]>([])
/*** 아래 TARGETS는 사이트에 맞게 수정 필요 ***/
const TARGETS = [
  { id: "free", limit: 8 },
  { id: "sirini", limit: 8 },
  { id: "photo", limit: 4 },
]
const ICONS = ["mdi-forum", "mdi-image-multiple", "mdi-post", "mdi-shopping"] // BOARD, GALLERY, BLOG, SHOP

onMounted(async () => {
  home.setGridLayout()
  for (const target of TARGETS) {
    boards.value.push(await home.getBoardLatestPosts(target.id, target.limit))
  }
})
</script>
