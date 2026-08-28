<script setup lang="ts">
import { Inbox } from "lucide-vue-next"
defineProps<{ title: string; message?: string }>()
</script>
<template>
  <div class="rounded-lg border border-dashed px-6 py-14 text-center">
    <Inbox class="mx-auto mb-3 size-8 text-muted-foreground" />
    <h2 class="font-semibold">{{ title }}</h2>
    <p v-if="message" class="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{{ message }}</p>
    <div v-if="$slots.default" class="mt-5"><slot /></div>
  </div>
</template>
