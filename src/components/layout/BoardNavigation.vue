<script setup lang="ts">
import { CircleDot, Image, MessageSquareText, Newspaper, ShoppingBag } from "lucide-vue-next"
import { computed, type Component } from "vue"
import { useRoute } from "vue-router"
import { BOARD, type BoardType } from "@/types/board"
import { useHomeStore } from "@/stores/home"

defineEmits<{ navigate: [] }>()
const home = useHomeStore()
const route = useRoute()
const boardIcons: Partial<Record<BoardType, Component>> = {
  [BOARD.GALLERY]: Image,
  [BOARD.BLOG]: Newspaper,
  [BOARD.TRADE]: ShoppingBag,
  [BOARD.DEFAULT]: MessageSquareText,
  [BOARD.WEBZINE]: MessageSquareText,
}
const iconFor = (type: BoardType) => boardIcons[type] ?? CircleDot
const activeId = computed(() => String(route.params.id ?? ""))
</script>

<template>
  <nav class="space-y-5 text-sm" :aria-label="$t('navigation.communities')">
    <div v-for="group in home.groups" :key="group.group">
      <h2
        class="font-label mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {{ group.group }}
      </h2>
      <RouterLink
        v-for="board in group.boards"
        :key="board.id"
        :to="`/board/${board.id}`"
        :class="[
          'flex items-start gap-2 rounded-md px-3 py-2 transition-colors hover:bg-accent',
          activeId === board.id && 'bg-accent font-medium',
        ]"
        @click="$emit('navigate')"
      >
        <component :is="iconFor(board.type)" class="mt-0.5 size-4 shrink-0" />
        <span class="min-w-0"
          ><span class="block truncate">{{ board.name }}</span
          ><span class="line-clamp-1 text-xs font-normal text-muted-foreground">{{
            board.info
          }}</span></span
        >
      </RouterLink>
    </div>
    <p v-if="!home.menuLoading && !home.groups.length" class="px-3 text-sm text-muted-foreground">
      {{ $t("community.none") }}
    </p>
  </nav>
</template>
