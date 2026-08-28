<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next"
import { computed } from "vue"
import { Button } from "@/components/ui/button"
const props = defineProps<{ page: number; total: number; pageSize: number }>()
const emit = defineEmits<{ change: [page: number] }>()
const pages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
</script>
<template>
  <nav class="flex items-center justify-center gap-2" aria-label="Pagination">
    <Button
      variant="outline"
      size="icon-sm"
      :disabled="page <= 1"
      aria-label="Previous page"
      @click="emit('change', page - 1)"
      ><ChevronLeft /></Button
    ><span class="min-w-24 text-center text-sm text-muted-foreground"
      >Page {{ page }} of {{ pages }}</span
    ><Button
      variant="outline"
      size="icon-sm"
      :disabled="page >= pages"
      aria-label="Next page"
      @click="emit('change', page + 1)"
      ><ChevronRight
    /></Button>
  </nav>
</template>
