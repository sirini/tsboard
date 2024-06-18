<template>
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
import { useHomeStore } from "../../../../store/home"

const home = useHomeStore()

onMounted(() => {
  await home.loadLatestPosts()
  let timer: Timer
  window.onscroll = (event: Event) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      const scroll = window.innerHeight + window.scrollY + 50
      if (scroll > document.body.offsetHeight) {
        home.loadLatestPosts()
      }
    }, 250)
  }
})
</script>
