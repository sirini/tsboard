<script setup lang="ts">
import { Skeleton } from "@/components/ui/skeleton"
</script>
<template>
  <div class="space-y-3">
    <div v-for="index in 4" :key="index" class="rounded-lg border bg-card p-4">
      <div class="flex gap-3">
        <Skeleton class="h-16 w-10" />
        <div class="flex-1 space-y-3">
          <Skeleton class="h-3 w-1/3" /><Skeleton class="h-5 w-4/5" /><Skeleton
            class="h-3 w-full"
          /><Skeleton class="h-3 w-2/3" />
        </div>
      </div>
    </div>
  </div>
</template>
