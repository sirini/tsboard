<template>
  <v-list-item class="pt-2 pb-2">
    <v-row no-gutters>
      <v-col v-for="(image, index) in viewer.images" :key="index" cols="2">
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
