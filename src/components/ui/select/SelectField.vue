<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
defineOptions({ inheritAttrs: false })
defineProps<{ class?: HTMLAttributes["class"] }>()
const model = defineModel<string | number | boolean>()
</script>
<template>
  <select
    v-model="model"
    v-bind="$attrs"
    :class="
      cn(
        'flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-ring',
        $props.class,
      )
    "
  >
    <slot />
  </select>
</template>
