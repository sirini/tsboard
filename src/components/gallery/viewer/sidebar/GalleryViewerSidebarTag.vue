<template>
  <v-list-item class="pt-2 pb-2">
    <v-chip
      variant="text"
      prepend-icon="mdi-tag-outline"
      class="mr-2 mb-2"
      v-for="(tag, index) in viewer.tags"
      :key="index"
      >{{ tag.name }}</v-chip
    >
  </v-list-item>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../../store/board/gallery/viewer"

const viewer = useViewerStore()
</script>
