<template>
  <div class="pa-3">
    <v-chip
      variant="text"
      size="small"
      prepend-icon="mdi-tag-outline"
      class="mr-2 mb-2"
      v-for="(tag, index) in tags"
      :key="index"
      >{{ tag.name }}</v-chip
    >
  </div>
</template>

<script setup lang="ts">
import { Pair } from "../../../interface/board_interface"

const props = defineProps<{
  tags: Pair[]
}>()
</script>
