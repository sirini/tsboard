<template>
  <v-list-item class="pt-2 pb-2">
    <v-row no-gutters>
      <v-col v-for="(image, index) in viewer.images" :key="index" cols="3">
        <v-img
          cover
          height="80"
          :src="image.thumbnail.small"
          :class="viewer.position === index ? 'selected' : 'deselected'"
          @click="viewer.position = index"
        ></v-img>
      </v-col>
    </v-row>
  </v-list-item>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../../store/board/gallery/viewer"

const viewer = useViewerStore()
</script>

<style scoped>
.selected {
  margin-left: 5px;
  margin-right: 5px;
  border-radius: 5px;
  transition: all 0.3s ease;
}
.deselected {
  background-color: black;
  opacity: 0.3;
  transition: all 0.3s ease;
}
</style>
