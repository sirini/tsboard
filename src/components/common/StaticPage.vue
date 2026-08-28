<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; description: string }>()
</script>
<template>
  <article class="rounded-lg border bg-card p-5 sm:p-8">
    <p class="font-label text-xs font-semibold uppercase tracking-widest text-primary">
      {{ eyebrow }}
    </p>
    <h1 class="mt-2 text-3xl font-bold tracking-tight">{{ title }}</h1>
    <p class="mt-2 text-muted-foreground">{{ description }}</p>
    <div class="content-body mt-8"><slot /></div>
  </article>
</template>
