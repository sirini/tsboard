<script setup lang="ts">
import { UserRound } from "lucide-vue-next"
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
defineProps<{ src?: string; alt?: string; class?: HTMLAttributes["class"] }>()
</script>
<template>
  <span
    :class="
      cn('relative inline-flex size-9 shrink-0 overflow-hidden rounded-full bg-muted', $props.class)
    "
    ><img v-if="src" :src="src" :alt="alt ?? ''" class="size-full object-cover" /><span
      v-else
      class="grid size-full place-items-center text-muted-foreground"
      ><UserRound class="size-4" /></span
  ></span>
</template>
