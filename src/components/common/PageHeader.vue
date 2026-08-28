<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; description?: string }>()
</script>
<template>
  <div class="mb-5">
    <p
      v-if="eyebrow"
      class="font-label mb-1 text-xs font-semibold uppercase tracking-widest text-primary"
    >
      {{ eyebrow }}
    </p>
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">{{ title }}</h1>
        <p v-if="description" class="mt-1 max-w-2xl text-sm text-muted-foreground">
          {{ description }}
        </p>
      </div>
      <slot />
    </div>
  </div>
</template>
