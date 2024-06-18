<template>
  <v-app class="app">
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-card class="mx-auto wrap app" elevation="0" rounded="0" :max-width="home.width">
          <tsboard-home-title></tsboard-home-title>

          <v-row class="mt-3 mb-3" v-if="home.isMobile || home.isTablet">
            <v-col>
              <v-card :color="home.color.header" class="pt-1 pb-1">
                <home-header-search :is-small-screen="true"></home-header-search>
              </v-card>
            </v-col>
          </v-row>

          <v-list-subheader
            ><strong class="mr-2">{{ photos.name }}</strong> {{ photos.info }}</v-list-subheader
          >
          <v-divider></v-divider>
          <v-row class="mt-3 mb-3">
            <v-col v-for="(photo, index) in photos.posts" :key="index" :cols="home.cols">
              <home-page-grid-post :post="photo"></home-page-grid-post>
            </v-col>
          </v-row>

          <v-list-subheader
            ><strong class="mr-2">{{ frees.name }}</strong> {{ frees.info }}</v-list-subheader
          >
          <v-divider></v-divider>
          <v-row class="mt-3 mb-3">
            <v-col v-for="(free, index) in frees.posts" :key="index" :cols="home.cols">
              <home-page-grid-post :post="free"></home-page-grid-post>
            </v-col>
          </v-row>

          <v-list-subheader
            ><strong class="mr-2">{{ blogs.name }}</strong> {{ blogs.info }}</v-list-subheader
          >
          <v-divider></v-divider>
          <v-row class="mt-3 mb-3">
            <v-col v-for="(blog, index) in blogs.posts" :key="index" :cols="home.cols">
              <home-page-grid-post :post="blog"></home-page-grid-post>
            </v-col>
          </v-row>

          <!--  -->
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
import HomeHeader from "./HomeHeader.vue"
import HomeFooter from "./HomeFooter.vue"
import SideDrawer from "./SideDrawer.vue"
import HomePageGridPost from "./components/list/HomePageGridPost.vue"
import HomeHeaderSearch from "./components/header/HomeHeaderSearch.vue"
import QuickButton from "./components/mobile/QuickButton.vue"
import { BoardLatestPost, PostItem } from "../../interface/home"
import TsboardHomeTitle from "./components/static/TsboardHomeTitle.vue"

const home = useHomeStore()

const frees = ref<BoardLatestPost>({ name: "", info: "", posts: [] as PostItem[] })
const photos = ref<BoardLatestPost>({ name: "", info: "", posts: [] as PostItem[] })
const blogs = ref<BoardLatestPost>({ name: "", info: "", posts: [] as PostItem[] })

onMounted(async () => {
  home.setGridLayout()
  const limit = 4
  frees.value = await home.getBoardLatestPosts("free", limit * 2)
  photos.value = await home.getBoardLatestPosts("photo", limit)
  blogs.value = await home.getBoardLatestPosts("story", limit)
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
