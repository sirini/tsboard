<template>
  <v-list-item class="pb-2" v-if="viewer.tags.length > 0">
    <v-chip
      variant="text"
      size="small"
      prepend-icon="mdi-tag-outline"
      v-for="(tag, index) in viewer.tags"
      :key="index"
      >{{ tag.name }}</v-chip
    >
  </v-list-item>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../../store/board/gallery.viewer"

const viewer = useViewerStore()
</script>
