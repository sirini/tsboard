<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
defineOptions({ inheritAttrs: false })
defineProps<{ class?: HTMLAttributes["class"] }>()
const model = defineModel<string>()
</script>
<template>
  <textarea
    v-model="model"
    v-bind="$attrs"
    :class="
      cn(
        'flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
        $props.class,
      )
    "
  />
</template>
