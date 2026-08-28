<script setup lang="ts">
import { ArrowBigUp } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { formatNumber } from "@/lib/utils"
defineProps<{ score: number; liked?: boolean; disabled?: boolean; horizontal?: boolean }>()
defineEmits<{ toggle: [] }>()
</script>
<template>
  <div :class="['flex items-center', horizontal ? 'gap-1' : 'flex-col']">
    <Button
      :variant="liked ? 'secondary' : 'ghost'"
      size="icon-sm"
      :disabled="disabled"
      :class="liked && 'text-primary'"
      :aria-label="liked ? $t('common.removeUpvote') : $t('common.upvote')"
      @click.stop="$emit('toggle')"
      ><ArrowBigUp :class="liked && 'fill-current'" /></Button
    ><span class="min-w-6 text-center text-xs font-semibold">{{ formatNumber(score) }}</span>
  </div>
</template>
