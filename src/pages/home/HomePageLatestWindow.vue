<template>
  <v-chip prepend-icon="mdi-update" size="large" :color="COLOR.HOME.MAIN" class="mt-6 mb-3 mr-3">
    <strong>{{ home.keyword.length > 0 ? `Search for: ${home.keyword}` : "Latest posts" }}</strong>
  </v-chip>
  <v-row>
    <v-col v-for="(post, index) in home.latestPosts" :key="index" :cols="home.cols">
      <home-page-grid-post :post="post"></home-page-grid-post>
    </v-col>

    <v-col :cols="home.cols">
      <load-previous-post></load-previous-post>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import HomePageGridPost from "./components/list/HomePageGridPost.vue"
import LoadPreviousPost from "./components/static/LoadPreviousPost.vue"
import { COLOR } from "../../../tsboard.config"

const home = useHomeStore()
const util = useUtilStore()

onMounted(async () => {
  await home.loadLatestPosts()

  const waitLoadPosts = util.debounce(home.loadLatestPosts)
  window.onscroll = (event: Event) => waitLoadPosts()
})
</script>
