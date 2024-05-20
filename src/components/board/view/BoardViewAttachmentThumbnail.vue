<template>
  <v-list-item class="pa-6" v-if="view.thumbs.length > 0">
    <v-row>
      <v-col :cols="home.cols" v-for="(thumb, index) in view.thumbs" :key="index">
        <v-card elevation="0">
          <v-img cover :src="thumb"></v-img>
          <v-card-text class="description pa-3">{{ view.descriptions[index] }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-list-item>
  <v-divider v-if="view.thumbs.length > 0"></v-divider>
</template>

<script setup lang="ts">
import { useBoardViewStore } from "../../../store/board/view"
import { useHomeStore } from "../../../store/home"

const view = useBoardViewStore()
const home = useHomeStore()
</script>

<style scoped>
.description {
  background-color: #f8fafb;
  line-height: 1.6em;
}
</style>
