<template>
  <v-list-item class="pa-3">
    <v-chip
      label
      prepend-icon="mdi-tag-outline"
      class="mr-2 mb-2"
      v-for="(tag, index) in tags"
      :key="index"
      >{{ tag.name }}</v-chip
    >
  </v-list-item>
</template>

<script setup lang="ts">
import { Pair } from "../../../interface/board"

const props = defineProps<{
  tags: Pair[]
}>()
</script>
