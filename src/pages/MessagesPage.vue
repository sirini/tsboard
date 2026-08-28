<script setup lang="ts">
import { Mail, MessageCircle } from "lucide-vue-next"
import { onMounted, ref } from "vue"
import { toast } from "vue-sonner"
import { chatApi } from "@/api/chat"
import EmptyState from "@/components/common/EmptyState.vue"
import PageHeader from "@/components/common/PageHeader.vue"
import ChatDialog from "@/components/profile/ChatDialog.vue"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { recoverChars, relativeTime } from "@/lib/utils"
import type { ChatItem } from "@/types/content"

const conversations = ref<ChatItem[]>([])
const loading = ref(true)
const chatOpen = ref(false)
const selected = ref<ChatItem | null>(null)

const load = async () => {
  loading.value = true
  try {
    const response = await chatApi.list(50)
    if (!response.success) return toast.error(response.error)
    conversations.value = response.result
  } catch (error) {
    toast.error(`Messages could not be loaded: ${String(error)}`)
  } finally {
    loading.value = false
  }
}

const openChat = (item: ChatItem) => {
  selected.value = item
  chatOpen.value = true
}

onMounted(load)
</script>

<template>
  <PageHeader
    eyebrow="Inbox"
    title="Messages"
    description="Continue private conversations with community members."
  />
  <Card>
    <CardContent class="p-0">
      <div v-if="loading" class="py-20 text-center"><Spinner label="Loading messages" /></div>
      <div v-else-if="conversations.length" class="divide-y">
        <button
          v-for="item in conversations"
          :key="item.uid"
          class="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-accent"
          @click="openChat(item)"
        >
          <Avatar :src="item.sender.profile" :alt="item.sender.name" />
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-3">
              <strong class="truncate text-sm">{{ recoverChars(item.sender.name) }}</strong>
              <span class="shrink-0 text-xs text-muted-foreground">{{
                relativeTime(item.timestamp)
              }}</span>
            </div>
            <p class="mt-1 truncate text-sm text-muted-foreground">
              {{ recoverChars(item.message) }}
            </p>
          </div>
          <MessageCircle class="size-4 shrink-0 text-muted-foreground" />
        </button>
      </div>
      <EmptyState
        v-else
        class="border-0"
        title="Your inbox is empty"
        message="Open a member profile to start a private conversation."
      >
        <Button as-child variant="outline"
          ><RouterLink to="/"><Mail />Browse posts</RouterLink></Button
        >
      </EmptyState>
    </CardContent>
  </Card>
  <ChatDialog
    v-if="selected"
    v-model="chatOpen"
    :user-uid="selected.sender.uid"
    :user-name="recoverChars(selected.sender.name)"
  />
</template>
