<script setup lang="ts">
import type { HTMLAttributes, InputHTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
defineOptions({ inheritAttrs: false })
defineProps<{ class?: HTMLAttributes["class"]; type?: InputHTMLAttributes["type"] }>()
const model = defineModel<string | number>()
</script>
<template>
  <input
    v-model="model"
    v-bind="$attrs"
    :type="type"
    :class="
      cn(
        'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
        $props.class,
      )
    "
  />
</template>
