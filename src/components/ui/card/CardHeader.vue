<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
defineProps<{ class?: HTMLAttributes["class"] }>()
</script>
<template>
  <div :class="cn('flex flex-col gap-1.5 p-5', $props.class)"><slot /></div>
</template>
