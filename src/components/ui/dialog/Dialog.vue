<script setup lang="ts">
import { X } from "lucide-vue-next"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "reka-ui"

withDefaults(
  defineProps<{ title: string; description?: string; width?: "sm" | "md" | "lg" | "xl" }>(),
  { width: "md" },
)
const open = defineModel<boolean>({ required: true })
const widths = { sm: "sm:max-w-sm", md: "sm:max-w-lg", lg: "sm:max-w-2xl", xl: "sm:max-w-4xl" }
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out"
      />
      <DialogContent
        :class="[
          'fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border bg-background p-5 shadow-xl',
          widths[width],
        ]"
      >
        <div class="mb-5 pr-8">
          <DialogTitle class="text-lg font-semibold">{{ title }}</DialogTitle>
          <DialogDescription v-if="description" class="mt-1 text-sm text-muted-foreground">{{
            description
          }}</DialogDescription>
        </div>
        <slot />
        <div v-if="$slots.footer" class="mt-6 flex flex-wrap justify-end gap-2">
          <slot name="footer" />
        </div>
        <DialogClose
          class="absolute right-4 top-4 rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          :aria-label="$t('common.close')"
          ><X class="size-4"
        /></DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
