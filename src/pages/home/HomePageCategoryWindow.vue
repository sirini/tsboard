<template>
  <div v-for="(result, index) in results" :key="index">
    <v-chip
      label
      :prepend-icon="ICONS[result.config.type]"
      size="large"
      :color="COLOR.HOME.HEADER"
      class="mt-6 mb-3 mr-3"
      @click="util.go(result.config.type, result.config.id)"
    >
      <strong>{{ util.unescape(result.config.name) }}</strong>
      <v-divider vertical class="ml-3 mr-3"></v-divider>
      {{ util.unescape(result.config.info) }}
    </v-chip>

    <v-row class="mb-3">
      <v-col v-for="(post, index) in result.items" :key="index" :cols="home.cols">
        <home-page-board-latest-grid
          :type="result.config.type"
          :id="result.config.id"
          :use-category="result.config.useCategory"
          :post="post"
        ></home-page-board-latest-grid>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { BoardHomePostResult } from "../../interface/home_interface"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import HomePageBoardLatestGrid from "./components/list/HomePageBoardLatestGrid.vue"
import { COLOR } from "../../../tsboard.config"

const home = useHomeStore()
const util = useUtilStore()

const results = ref<BoardHomePostResult[]>([])
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
    results.value.push(await home.getBoardLatestPosts(target.id, target.limit))
  }
})
</script>
