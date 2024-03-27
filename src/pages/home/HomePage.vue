<template>
  <v-app class="app">
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-card class="mx-auto wrap app" elevation="0" rounded="0" :max-width="home.width">
          <v-row class="mt-6 mb-12">
            <v-col :cols="home.cols">
              <what-is-tsboard></what-is-tsboard>
            </v-col>

            <v-col :cols="home.cols">
              <how-to-get-tsboard></how-to-get-tsboard>
            </v-col>

            <v-col :cols="home.cols">
              <home-page-grid-board id="free" name="자유게시판" :limit="5"></home-page-grid-board>
            </v-col>

            <v-col v-for="(post, index) in home.latestPosts" :key="index" :cols="home.cols">
              <home-page-grid-post :post="post"></home-page-grid-post>
            </v-col>

            <v-col :cols="home.cols">
              <load-previous-post></load-previous-post>
            </v-col>
          </v-row>
        </v-card>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useHomeStore } from "../../store/home"
import { LatestPost } from "../../interface/home"
import HomeHeader from "./HomeHeader.vue"
import HomeFooter from "./HomeFooter.vue"
import SideDrawer from "./SideDrawer.vue"
import WhatIsTsboard from "./components/static/WhatIsTsboard.vue"
import HowToGetTsboard from "./components/static/HowToGetTsboard.vue"
import LoadPreviousPost from "./components/static/LoadPreviousPost.vue"
import HomePageGridBoard from "./components/list/HomePageGridBoard.vue"
import HomePageGridPost from "./components/list/HomePageGridPost.vue"

const home = useHomeStore()
const freeBoardList = ref<LatestPost[]>([])

onMounted(async () => {
  home.loadLatestPosts()
  freeBoardList.value = await home.getBoardLatest("free", 5)
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
.box {
  font-size: 1em;
  height: 300px;
}
</style>
