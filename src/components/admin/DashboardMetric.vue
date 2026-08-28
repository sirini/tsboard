<script setup lang="ts">
import { computed } from "vue"
import type { Component } from "vue"
import type { DashboardSeries } from "@/types/admin"
import { formatNumber } from "@/lib/utils"
const props = defineProps<{ label: string; series: DashboardSeries; icon: Component }>()
const max = computed(() => Math.max(1, ...props.series.history.map((item) => item.visit)))
</script>
<template>
  <div class="rounded-lg border bg-card p-4">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ label }}</p>
        <p class="mt-1 text-2xl font-bold">{{ formatNumber(series.total) }}</p>
      </div>
      <component :is="icon" class="size-5 text-primary" />
    </div>
    <div class="mt-5 flex h-16 items-end gap-1" aria-hidden="true">
      <span
        v-for="item in series.history"
        :key="item.date"
        class="min-h-1 flex-1 rounded-sm bg-primary/70"
        :style="{ height: `${Math.max(5, (item.visit / max) * 100)}%` }"
      />
    </div>
  </div>
</template>
