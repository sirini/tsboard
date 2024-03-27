<template>
  <v-card
    rounded="xl"
    class="box"
    :color="home.color.header"
    @click="home.loadLatestPosts"
    variant="outlined"
  >
    <v-card-title class="post-title">이전글 더 불러오기</v-card-title>
    <v-card-text class="text-center mt-6">
      <v-icon size="150">mdi-restore</v-icon>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../../../store/home"

const home = useHomeStore()
</script>

<style scoped>
.post-title {
  font-size: 1em;
  font-weight: bold;
}
</style>
