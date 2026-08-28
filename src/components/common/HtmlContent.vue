<script setup lang="ts">
import { computed } from "vue"
import { sanitizeHtml } from "@/lib/sanitize"
const props = defineProps<{ html: string; compact?: boolean }>()
const clean = computed(() => sanitizeHtml(props.html))
</script>
<template>
  <div
    :class="['content-body', compact && 'line-clamp-3 text-sm text-muted-foreground']"
    v-html="clean"
  />
</template>
