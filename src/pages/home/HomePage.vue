<template>
  <v-app class="app">
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-card class="mx-auto wrap app" elevation="0" rounded="0" :max-width="home.width">
          <v-row class="mt-3 mb-12">
            <v-col :cols="home.cols" v-if="home.isMobile || home.isTablet">
              <v-card :color="home.color.header" class="pt-1 pb-1">
                <home-header-search :is-small-screen="true"></home-header-search>
              </v-card>
            </v-col>

            <v-col :cols="home.cols" v-if="home.isMobile === false">
              <what-is-tsboard></what-is-tsboard>
            </v-col>

            <v-col :cols="home.cols">
              <home-page-grid-board id="free" :limit="5"></home-page-grid-board>
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

        <quick-button v-if="home.isMobile"></quick-button>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useHomeStore } from "../../store/home"
import HomeHeader from "./HomeHeader.vue"
import HomeFooter from "./HomeFooter.vue"
import SideDrawer from "./SideDrawer.vue"
import WhatIsTsboard from "./components/static/WhatIsTsboard.vue"
import LoadPreviousPost from "./components/static/LoadPreviousPost.vue"
import HomePageGridBoard from "./components/list/HomePageGridBoard.vue"
import HomePageGridPost from "./components/list/HomePageGridPost.vue"
import HomeHeaderSearch from "./components/header/HomeHeaderSearch.vue"
import QuickButton from "./components/mobile/QuickButton.vue"

const home = useHomeStore()
onMounted(async () => {
  await home.loadLatestPosts()

  window.onscroll = (event: Event) => {
    // const scroll = window.innerHeight + window.scrollY + 50
    // if (scroll > document.body.offsetHeight) {
    //   home.loadLatestPosts()
    // }
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
/* for HomePageGrid(Board|Post).vue */
.box {
  font-size: 1em;
  height: 300px;
}
</style>
