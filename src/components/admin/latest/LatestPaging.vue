<template>
  <v-card-actions class="mb-3">
    <v-btn prepend-icon="mdi-chevron-left" :disabled="page < 2" @click="emits('prev')">이전</v-btn>
    <v-spacer></v-spacer>
    <v-chip variant="tonal" color="blue-grey-lighten-3">{{ page }} / {{ pageLength }}</v-chip>
    <v-spacer></v-spacer>
    <v-btn append-icon="mdi-chevron-right" :disabled="page >= pageLength" @click="emits('next')"
      >다음</v-btn
    >
  </v-card-actions>
</template>

<script setup lang="ts">
const props = defineProps<{
  page: number
  pageLength: number
}>()
const emits = defineEmits<{
  prev: []
  next: []
}>()
</script>
