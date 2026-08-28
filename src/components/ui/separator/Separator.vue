<script setup lang="ts">
defineProps<{ vertical?: boolean }>()
</script>
<template>
  <div :class="vertical ? 'h-full w-px bg-border' : 'h-px w-full bg-border'" role="separator" />
</template>
