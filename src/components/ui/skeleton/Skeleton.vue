<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
defineProps<{ class?: HTMLAttributes["class"] }>()
</script>
<template><div :class="cn('animate-pulse rounded-md bg-muted', $props.class)" /></template>
