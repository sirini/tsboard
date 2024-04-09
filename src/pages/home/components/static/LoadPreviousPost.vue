<template>
  <v-card class="box" :color="home.color.header" @click="home.loadLatestPosts" variant="text">
    <v-card-text class="text-center mt-12">
      <v-icon size="150">mdi-restore</v-icon>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../../../store/home"

const home = useHomeStore()
</script>
