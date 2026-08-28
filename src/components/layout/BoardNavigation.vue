<script setup lang="ts">
import {
  CircleDot,
  Globe2,
  Image,
  Layers3,
  MessageSquareText,
  Newspaper,
  ServerCog,
  ShoppingBag,
} from "lucide-vue-next"
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
const nuboLinks = [
  {
    name: "NUBOHUB",
    info: "a new unified board",
    href: "https://nubohub.org",
    icon: Globe2,
  },
  {
    name: "NUBO",
    info: "next level of community",
    href: "https://github.com/sirini/nubo",
    icon: Layers3,
  },
  {
    name: "GOAPI",
    info: "infrastructure of community",
    href: "https://github.com/sirini/goapi",
    icon: ServerCog,
  },
]
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
    <div>
      <h2
        class="font-label mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        NUBO
      </h2>
      <a
        v-for="link in nuboLinks"
        :key="link.name"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-start gap-2 rounded-md px-3 py-2 transition-colors hover:bg-accent"
        @click="$emit('navigate')"
      >
        <component :is="link.icon" class="mt-0.5 size-4 shrink-0" />
        <span class="min-w-0"
          ><span class="block truncate">{{ link.name }}</span
          ><span class="line-clamp-1 text-xs font-normal text-muted-foreground">{{
            link.info
          }}</span></span
        >
      </a>
    </div>
  </nav>
</template>
