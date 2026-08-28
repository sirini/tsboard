<script setup lang="ts">
import { Eye, Image as ImageIcon, MessageCircle, Pin, ShoppingBag } from "lucide-vue-next"
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import type { BoardListItem, BoardType, TradeInfo } from "@/types/board"
import { BOARD, STATUS } from "@/types/board"
import { Badge } from "@/components/ui/badge"
import HtmlContent from "@/components/common/HtmlContent.vue"
import UserLine from "@/components/common/UserLine.vue"
import VoteControl from "@/components/common/VoteControl.vue"
import { formatNumber, recoverChars, stripTags } from "@/lib/utils"

const props = defineProps<{
  post: BoardListItem
  boardId: string
  boardName?: string
  boardType?: BoardType
  trade?: TradeInfo
  compact?: boolean
}>()
const { locale } = useI18n()
defineEmits<{ vote: [post: BoardListItem] }>()
const path = computed(() => `/board/${props.boardId}/${props.post.uid}`)
const excerpt = computed(() => stripTags(props.post.content).slice(0, 260))
const isGallery = computed(() => props.boardType === BOARD.GALLERY)
const formatPrice = (trade: TradeInfo) =>
  new Intl.NumberFormat(locale.value === "ko" ? "ko-KR" : "en-US", {
    style: "currency",
    currency: trade.currency || "USD",
  }).format(trade.price)
</script>

<template>
  <article
    class="group overflow-hidden rounded-lg border bg-card transition-colors hover:border-muted-foreground/35"
  >
    <div class="flex">
      <div class="hidden w-11 shrink-0 justify-center bg-muted/40 py-3 sm:flex">
        <VoteControl :score="post.like" :liked="post.liked" @toggle="$emit('vote', post)" />
      </div>
      <div class="min-w-0 flex-1 p-3 sm:p-4">
        <div class="mb-2 flex flex-wrap items-center gap-2">
          <Badge v-if="post.status === STATUS.NOTICE" variant="secondary"
            ><Pin class="mr-1 size-3" />{{ $t("post.pinned") }}</Badge
          >
          <RouterLink
            v-if="boardName"
            :to="`/board/${boardId}`"
            class="text-xs font-semibold hover:underline"
            >t/{{ boardId }}</RouterLink
          >
          <UserLine
            :uid="post.writer.uid"
            :name="post.writer.name"
            :profile="post.writer.profile"
            :timestamp="post.submitted"
            compact
          />
        </div>
        <RouterLink :to="path"
          ><h2 class="text-base font-semibold leading-snug group-hover:text-primary sm:text-lg">
            {{ recoverChars(post.title) }}
          </h2></RouterLink
        >
        <RouterLink
          v-if="post.cover"
          :to="path"
          :class="[
            'mt-3 block overflow-hidden rounded-md bg-muted',
            isGallery ? 'max-h-[32rem]' : 'max-h-56',
          ]"
          ><img
            :src="post.cover"
            :alt="post.title"
            class="h-full max-h-[32rem] w-full object-cover"
            loading="lazy"
        /></RouterLink>
        <RouterLink v-else-if="!compact && excerpt" :to="path" class="mt-2 block"
          ><HtmlContent :html="excerpt" compact
        /></RouterLink>
        <div v-if="trade" class="mt-3 flex flex-wrap gap-2 text-sm">
          <Badge variant="outline"
            ><ShoppingBag class="mr-1 size-3" />{{ trade.brand || $t("post.item") }}</Badge
          ><Badge variant="secondary">{{
            trade.priceType === 2 ? $t("post.free") : formatPrice(trade)
          }}</Badge>
        </div>
        <div class="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <div class="sm:hidden">
            <VoteControl
              :score="post.like"
              :liked="post.liked"
              horizontal
              @toggle="$emit('vote', post)"
            />
          </div>
          <RouterLink
            :to="path"
            class="inline-flex items-center gap-1 rounded-md px-2 py-1.5 font-medium hover:bg-accent"
            ><MessageCircle class="size-4" />{{
              $t("post.comments", { count: formatNumber(post.comment) })
            }}</RouterLink
          ><span class="inline-flex items-center gap-1 px-2 py-1.5"
            ><Eye class="size-4" />{{ formatNumber(post.hit) }}</span
          ><span v-if="post.cover" class="inline-flex items-center gap-1 px-2 py-1.5"
            ><ImageIcon class="size-4" />{{ $t("post.media") }}</span
          >
        </div>
      </div>
    </div>
  </article>
</template>
