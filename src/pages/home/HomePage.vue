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
              <why-developing-tsboard></why-developing-tsboard>
            </v-col>

            <v-col :cols="home.cols">
              <how-to-get-tsboard></how-to-get-tsboard>
            </v-col>

            <v-col :cols="home.cols">
              <home-page-grid-board id="free" :limit="5"></home-page-grid-board>
            </v-col>

            <v-col v-for="(post, index) in home.latestPosts" :key="index" :cols="home.cols">
              <v-card
                rounded="xl"
                class="box"
                @click="
                  util.go(
                    post.type === BOARD_TYPE.BOARD ? 'boardView' : 'galleryOpen',
                    post.id,
                    post.uid,
                  )
                "
              >
                <v-img
                  v-if="post.cover.length > 0"
                  height="200"
                  cover
                  :src="TSBOARD.PREFIX + post.cover"
                ></v-img>
                <v-card-title class="title">
                  <v-chip size="small" class="mr-2" label color="blue-grey">{{
                    util.unescape(post.category)
                  }}</v-chip
                  >{{ util.unescape(post.title) }}</v-card-title
                >
                <v-divider></v-divider>
                <v-card-text
                  v-if="post.cover.length < 1"
                  class="content"
                  v-html="post.content"
                ></v-card-text>
                <v-divider v-if="post.cover.length < 1"></v-divider>
                <v-card-actions class="pl-3 pr-3">
                  <v-chip
                    prepend-icon="mdi-eye-outline"
                    append-icon="mdi-heart-outline"
                    color="blue-grey"
                    size="small"
                    >{{ util.num(post.hit) }}
                    <v-divider vertical class="ml-3 mr-3"></v-divider>
                    {{ util.num(post.like) }}
                  </v-chip>
                  <v-spacer></v-spacer>
                  <v-chip
                    :prepend-avatar="
                      TSBOARD.PREFIX +
                      (post.writer.profile.length > 0 ? post.writer.profile : '/no-profile.svg')
                    "
                    size="small"
                    color="blue-grey"
                    >{{ util.unescape(post.writer.name) }}</v-chip
                  >
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col :cols="home.cols">
              <v-card
                rounded="xl"
                class="box"
                :color="home.color.header"
                @click="home.loadLatestPosts"
                variant="outlined"
              >
                <v-card-title class="title">이전 게시글 불러오기</v-card-title>
                <v-card-text class="text-center mt-6">
                  <v-icon size="150">mdi-restore</v-icon>
                </v-card-text>
              </v-card>
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
import { useUtilStore } from "../../store/util"
import { BOARD_TYPE } from "../../interface/board"
import { TSBOARD } from "../../../tsboard.config"
import { LatestPost } from "../../interface/home"
import HomeHeader from "./HomeHeader.vue"
import HomeFooter from "./HomeFooter.vue"
import SideDrawer from "./SideDrawer.vue"
import WhatIsTsboard from "./components/static/WhatIsTsboard.vue"
import WhyDevelopingTsboard from "./components/static/WhyDevelopingTsboard.vue"
import HowToGetTsboard from "./components/static/HowToGetTsboard.vue"
import HomePageGridBoard from "./components/list/HomePageGridBoard.vue"

const home = useHomeStore()
const util = useUtilStore()
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
  height: 300px;
  font-size: 1em;
}
.box .title {
  font-size: 1em;
  color: #37474f;
  height: 50px;
  font-weight: bold;
  overflow: hidden;
}
.box .list {
  line-height: 1.8em;
  font-size: 0.9em;
  color: #263238;
}
.box .content {
  height: 199px;
  overflow: hidden;
}
</style>
