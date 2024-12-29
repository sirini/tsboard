<template>
  <v-list-item class="pb-5">
    <v-card elevation="0" rounded="xl">
      <v-row no-gutters>
        <v-col v-for="(image, index) in viewer.images" :key="index" cols="3">
          <v-img
            cover
            height="80"
            :src="TSBOARD.PREFIX + image.thumbnail.small"
            :class="viewer.position === index ? 'selected' : 'deselected'"
            @click="viewer.position = index"
          ></v-img>
        </v-col>
      </v-row>
    </v-card>
  </v-list-item>
</template>

<script setup lang="ts">
import { TSBOARD } from "../../../../../tsboard.config"
import { useViewerStore } from "../../../../store/board/gallery.viewer"

const viewer = useViewerStore()
</script>

<style scoped>
.selected {
  transition: all 0.3s ease;
}
.deselected {
  background-color: black;
  opacity: 0.1;
  transition: all 0.3s ease;
}
</style>
