<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
defineProps<{
  variant?: "default" | "secondary" | "outline" | "destructive"
  class?: HTMLAttributes["class"]
}>()
const variants = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  outline: "text-foreground",
  destructive: "border-transparent bg-destructive text-destructive-foreground",
}
</script>
<template>
  <span
    :class="
      cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        variants[variant ?? 'default'],
        $props.class,
      )
    "
    ><slot
  /></span>
</template>
