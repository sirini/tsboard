<script setup lang="ts">
import { AlertCircle, CircleCheck, Info } from "lucide-vue-next"
defineProps<{ title?: string; variant?: "default" | "destructive" | "success" }>()
</script>
<template>
  <div
    :class="[
      'relative flex gap-3 rounded-lg border p-4 text-sm',
      variant === 'destructive' && 'border-destructive/40 text-destructive',
      variant === 'success' && 'border-emerald-600/40 text-emerald-700 dark:text-emerald-400',
    ]"
    role="alert"
  >
    <AlertCircle v-if="variant === 'destructive'" class="mt-0.5 size-4 shrink-0" /><CircleCheck
      v-else-if="variant === 'success'"
      class="mt-0.5 size-4 shrink-0"
    /><Info v-else class="mt-0.5 size-4 shrink-0" />
    <div>
      <p v-if="title" class="font-medium">{{ title }}</p>
      <div class="mt-1 text-current/80"><slot /></div>
    </div>
  </div>
</template>
