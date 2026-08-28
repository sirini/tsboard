<script setup lang="ts">
import { CheckCheck, MessageCircle, MessageSquare, ThumbsUp } from "lucide-vue-next"
import { useRouter } from "vue-router"
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { relativeTime } from "@/lib/utils"
import { useHomeStore } from "@/stores/home"
import type { NotificationItem } from "@/types/content"

const emit = defineEmits<{ close: [] }>()
const home = useHomeStore()
const router = useRouter()
const { tm } = useI18n()
const labels = computed(() => tm("header.notificationLabels") as string[])
const icons = [ThumbsUp, ThumbsUp, MessageCircle, MessageSquare, MessageSquare]

const openItem = async (item: NotificationItem) => {
  await home.markRead(item.uid)
  emit("close")
  if (item.type === 4) await router.push("/messages")
  else if (item.postUid) await router.push(`/board/${item.id}/${item.postUid}`)
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex justify-end">
      <Button v-if="home.unreadCount" variant="ghost" size="sm" @click="home.markAllRead"
        ><CheckCheck />{{ $t("header.markAllRead") }}</Button
      >
    </div>
    <div v-if="home.notificationLoading" class="py-10 text-center">
      <Spinner :label="$t('header.loadingNotifications')" />
    </div>
    <button
      v-for="item in home.notifications"
      :key="item.uid"
      :class="[
        'flex w-full gap-3 rounded-lg border p-3 text-left transition hover:bg-accent',
        !item.checked && 'border-primary/35 bg-primary/5',
      ]"
      @click="openItem(item)"
    >
      <component :is="icons[item.type]" class="mt-1 size-4 shrink-0 text-primary" /><span
        class="min-w-0"
        ><span class="font-medium">{{ item.fromUser.name }}</span> {{ labels[item.type]
        }}<span class="mt-1 block text-xs text-muted-foreground">{{
          relativeTime(item.timestamp)
        }}</span></span
      >
    </button>
    <p
      v-if="!home.notificationLoading && !home.notifications.length"
      class="py-10 text-center text-sm text-muted-foreground"
    >
      {{ $t("header.notificationsEmpty") }}
    </p>
  </div>
</template>
