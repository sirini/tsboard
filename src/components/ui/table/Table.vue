<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
defineProps<{ class?: HTMLAttributes["class"] }>()
</script>
<template>
  <div class="w-full overflow-x-auto">
    <table :class="cn('w-full caption-bottom text-sm', $props.class)">
      <slot />
    </table>
  </div>
</template>
