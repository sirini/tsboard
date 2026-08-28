<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
defineProps<{ class?: HTMLAttributes["class"] }>()
</script>
<template>
  <section :class="cn('rounded-lg border bg-card text-card-foreground shadow-sm', $props.class)">
    <slot />
  </section>
</template>
