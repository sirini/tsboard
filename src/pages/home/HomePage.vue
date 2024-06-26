<template>
  <v-app class="app">
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-card class="mx-auto wrap app pb-12" elevation="0" rounded="0" :max-width="home.width">
          <tsboard-home-title></tsboard-home-title>

          <v-row class="mt-3 mb-3" v-if="home.isMobile || home.isTablet">
            <v-col>
              <v-card :color="home.color.header" class="pt-1 pb-1">
                <home-header-search :is-small-screen="true"></home-header-search>
              </v-card>
            </v-col>
          </v-row>

          <div v-for="(board, index) in boards" :key="index">
            <v-chip
              label
              :prepend-icon="ICONS[board.type]"
              size="large"
              color="blue-grey"
              class="mt-6 mb-3 mr-3"
              @click="util.go(board.type, board.id)"
            >
              <strong>{{ board.name }}</strong> <v-divider vertical class="ml-3 mr-3"></v-divider>
              {{ board.info }}
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
        </v-card>

        <home-footer></home-footer>

        <quick-button v-if="home.isMobile"></quick-button>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import HomeHeader from "./HomeHeader.vue"
import HomeFooter from "./HomeFooter.vue"
import SideDrawer from "./SideDrawer.vue"
import HomePageBoardLatestGrid from "./components/list/HomePageBoardLatestGrid.vue"
import HomeHeaderSearch from "./components/header/HomeHeaderSearch.vue"
import QuickButton from "./components/mobile/QuickButton.vue"
import { BoardLatestPost } from "../../interface/home"
import TsboardHomeTitle from "./components/static/TsboardHomeTitle.vue"

const home = useHomeStore()
const util = useUtilStore()
const boards = ref<BoardLatestPost[]>([])
const TARGETS = [
  { id: "free", limit: 8 },
  { id: "photo", limit: 4 },
  { id: "story", limit: 4 },
]

const ICONS = ["mdi-forum", "mdi-image-multiple", "mdi-post", "mdi-shopping"] // BOARD, GALLERY, BLOG, SHOP

onMounted(async () => {
  home.setGridLayout()
  for (const target of TARGETS) {
    boards.value.push(await home.getBoardLatestPosts(target.id, target.limit))
  }
})
</script>

<style scoped>
.app {
  background-color: #eceff1;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.layout {
  margin-top: 64px;
}
</style>
