<script setup lang="ts">
import { LoaderCircle } from "lucide-vue-next"
defineProps<{ label?: string }>()
</script>
<template>
  <span class="inline-flex items-center gap-2 text-sm text-muted-foreground"
    ><LoaderCircle class="size-4 animate-spin" /><span v-if="label">{{ label }}</span></span
  >
</template>
